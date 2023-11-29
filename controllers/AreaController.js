// controllers/AreaController.js

const Area = require("../schema/AreaSchema");

class AreaController {
  async createArea(req, res) {
    const { areaId, name } = req.body;

    try {
      const area = new Area({ areaId, name, dustbins: [] });
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
      // Use findOne with the field you want to search (areaId)
      const area = await Area.findOne({ areaId });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      // Dynamically add a new dustbin to the dustbins array
      area.dustbins.push({
        coordinates,
        isVisited: false, // Set isVisited to false initially
        visitedTimestamp: null, // Set visitedTimestamp to null initially
      });

      const savedArea = await area.save();
      res.status(200).json(savedArea);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllDustbins(req, res) {
    const areaId = req.params.areaId;

    try {
      // Find the area by areaId
      const area = await Area.findOne({ areaId });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      // Extract dustbins information from the area
      const dustbins = area.dustbins.map((dustbin) => {
        return {
          coordinates: dustbin.coordinates,
        };
      });

      res.status(200).json(dustbins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getDustbinCount(req, res) {
    const { areaId } = req.params;

    try {
      // Use findOne with the field you want to search (areaId)
      const area = await Area.findOne({ areaId });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      // Get the count of objects inside the dustbin
      const dustbinCount = area.dustbins.length;

      res.status(200).json({ dustbinCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAreaByName(req, res) {
    const areaName = req.params.areaName;

    try {
      // Find the area by name
      const area = await Area.findOne({ name: areaName });

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      // Extract relevant information to send in the response
      const response = {
        name: area.name,
        dustbins: area.dustbins.map((dustbin) => {
          return {
            coordinates: dustbin.coordinates,
          };
        }),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllAreas(req, res) {
    try {
      // Find all areas in the database
      const areas = await Area.find();

      // Extract relevant information to send in the response
      const areaDetails = areas.map((area) => {
        return {
          areaId: area.areaId,
          name: area.name,
          dustbins: area.dustbins,
        };
      });

      res.status(200).json(areaDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


}

module.exports = new AreaController();
