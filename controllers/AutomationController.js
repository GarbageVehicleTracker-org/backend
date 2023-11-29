//AutomationController
const cron = require("node-cron");
const Area = require("../schema/AreaSchema");
class AutomationController{
      // Add a new method to start the automation task
  startAutomationTask() {
    // Schedule the automation task after 1 minute
    setTimeout(async () => {
      try {
        // Update the isVisited status as needed (your logic here)
        // Reset isVisited to false and visitedTimestamp to null for all dustbins
        await Area.updateMany(
          {},
          {
            $set: {
              "dustbins.$[].isVisited": false,
              "dustbins.$[].visitedTimestamp": null,
            },
          }
        );
        console.log("Automation task completed.");
      } catch (error) {
        console.error("Error in automation task:", error);
      }
    }, 36000000); // 1 minute in milliseconds
  }

  startNightlyAutomationTask() {
    // Schedule the automation task every night at a specific time (e.g., 1:00 AM)
    cron.schedule('0 1 * * *', async () => {
      try {
        // Update the isVisited status as needed (your logic here)
  
        // Reset isVisited to false and visitedTimestamp to null for all dustbins
        await Area.updateMany(
          {},
          {
            $set: {
              "dustbins.$[].isVisited": false,
              "dustbins.$[].visitedTimestamp": null,
            },
          }
        );
        console.log("Nightly Automation task completed.");
      } catch (error) {
        console.error("Error in nightly automation task:", error);
      }
    });
  }
}
module.exports = AutomationController;