// controllers/AreaController.js
const Area = require("../schema/AreaSchema");

class AreaController {
  async createArea(req, res) {
    const { name } = req.body;

    try {
      const area = new Area({ name, dustbins: [] });
      const savedArea = await area.save();
      res.status(201).json(savedArea);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addDustbin(req, res) {
    const { areaId, coordinates } = req.body;

    try {
      const area = await Area.findById(areaId);

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      // Dynamically add a new dustbin to the dustbins array
      area.dustbins.push({ coordinates });

      const savedArea = await area.save();
      res.status(200).json(savedArea);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new AreaController();
