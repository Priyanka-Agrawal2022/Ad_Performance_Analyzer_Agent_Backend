const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const uploadDir = path.join(__dirname, "../uploads");
const { LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const { ChatOpenAI } = require("@langchain/openai");

module.exports.upload = function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
    });
  } catch (error) {
    console.log("An error occurred:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred during file upload.",
      error: err.message,
    });
  }
};

module.exports.analyze = function (req, res) {
  try {
    const fileName = fs.readdirSync(uploadDir)[0];

    if (!fileName) {
      return res.status(404).json({
        success: false,
        message: "No CSV file found for analysis.",
      });
    }

    const filePath = path.join(uploadDir, fileName);
    const adsData = [];
    let summary = [];
    let highPerformingKeywords = [];
    let lowPerformingKeywords = [];
    let index = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        adsData.push(data);

        const ctr = parseFloat(data.CTR);
        const roas = parseFloat(data.ROAS);
        const acos = parseFloat(data.ACOS);
        const conversionRate = parseFloat(data["Conversion rate"]);
        const keyword = data["Added as"];
        const productKey = Object.keys(data).find(
          (key) => key.trim() === '"Matched product "'
        );
        const product = data[productKey];

        let analysis = "";
        let suggestions = "";

        if (roas >= 10 && acos <= 10 && ctr >= 5 && conversionRate >= 50) {
          analysis =
            "This ad is performing well, with a high ROAS, low ACOS, and good conversion rate.";
          highPerformingKeywords.push(keyword);
          suggestions =
            "Consider expanding your successful keywords to further drive performance.";
        } else if (roas < 1 && acos > 25) {
          analysis =
            "This ad is underperforming with a very low ROAS and high ACOS.";
          lowPerformingKeywords.push(keyword);
          suggestions =
            "Increase targeting to higher-performing keywords to improve ROAS. Reduce your ad spend or adjust bidding to lower ACOS.";
        } else if (ctr < 2 && data.Impressions > 100) {
          analysis =
            "This ad has a low CTR, indicating it's not engaging enough.";
          lowPerformingKeywords.push(keyword);
          suggestions = "Improve ad copy and targeting to increase CTR.";
        } else {
          analysis =
            "The ad performance is average. Consider optimizing for better returns.";
          suggestions =
            "Review keyword targeting and ad copy for better engagement.";
        }

        summary.push({
          adNumber: index + 1,
          roas,
          acos,
          ctr,
          conversionRate,
          product,
          analysis,
          suggestions: suggestions.trim(),
        });

        index++;
      })
      .on("end", async () => {
        fs.rm(uploadDir, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error("Error deleting uploads directory:", err);
          }
        });

        const model = new ChatOpenAI({
          apiKey: process.env.OpenAI_API_KEY,
          modelName: "gpt-3.5-turbo",
        });

        const prompt = `You are an expert in ad performance analysis. Based on the following data, generate a concise summary (approximately 5-7 sentences) of ad's performance and suggestions to improve.

        Ad Performance Data: {adsData}

        The summary should consider factors like Keyword performance meaning Keywords exhibiting a high ROAS, low ACOS, high CTR, and a strong click-to-purchase conversion rate are indicative of high performance. These keywords effectively drive sales while minimizing advertising costs.`;

        const promptTemplate = new PromptTemplate({
          template: prompt,
          inputVariables: ["adsData"],
        });

        const llmChain = new LLMChain({
          llm: model,
          prompt: promptTemplate,
        });

        // const summary = await llmChain.call({ adsData: JSON.stringify(adsData) });

        return res.status(200).json({
          success: true,
          data: {
            summary,
            highPerformingKeywords: highPerformingKeywords.filter(
              (hk) => hk !== ""
            ),
            lowPerformingKeywords: lowPerformingKeywords.filter(
              (lk) => lk !== ""
            ),
          },
        });
      });
  } catch (error) {
    console.log("An error occurred:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred during file analysis.",
      error: error.message,
    });
  }
};
