const Report = require('../models/Report');

exports.createReport = async (req, res) => {
    const { title, description, location } = req.body;
    try {
        const newReport = new Report({
            title,
            description,
            location,
            createdBy: req.user.id // Suppose que l'ID de l'utilisateur est attaché à la requête via un middleware d'authentification
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ msg: 'Signalement non trouvé' });
        res.json(report);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Signalement non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
};

exports.updateReport = async (req, res) => {
    // Logique pour mettre à jour un signalement
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ msg: 'Signalement non trouvé' });

        // Vérifier l'utilisateur
        if (report.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Utilisateur non autorisé' });
        }

        await report.remove();
        res.json({ msg: 'Signalement supprimé' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Signalement non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
};