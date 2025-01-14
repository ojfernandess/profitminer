const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar o MongoDB
mongoose.connect("mongodb+srv://<odairjosfernandess>:<Dve3g6OGAYxn3n6y>@cluster.mongodb.net/profits", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Esquema do MongoDB
const profitSchema = new mongoose.Schema({
    userId: String,
    planId: String,
    deposit: Number,
    percent: Number,
    currentProfit: Number,
    lastUpdated: Date,
});

const Profit = mongoose.model("Profit", profitSchema);

// Rotas
app.get("/profits/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const profits = await Profit.find({ userId });
        res.json(profits);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar lucros." });
    }
});

app.post("/profits", async (req, res) => {
    const { userId, planId, deposit, percent, currentProfit } = req.body;
    try {
        let profit = await Profit.findOne({ userId, planId });

        if (profit) {
            profit.currentProfit = currentProfit;
            profit.lastUpdated = new Date();
        } else {
            profit = new Profit({ userId, planId, deposit, percent, currentProfit, lastUpdated: new Date() });
        }

        await profit.save();
        res.json({ message: "Lucro salvo com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar lucro." });
    }
});

// Iniciar o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
