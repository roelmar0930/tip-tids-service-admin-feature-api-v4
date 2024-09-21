const config = require("./config/config");
const mongoose = require("mongoose");

mongoose.connect(config.databaseUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("MONGOOSE: connected");
  console.log("Collections:");
  mongoose.connection.db.listCollections().toArray((err, names) => {
    if (err) {
      console.log(err);
    } else {
      names.forEach((e, i, a) => {
        console.log("-->", e.name);
      });
    }
  });
});

mongoose.connection.on("close", () => {
  console.log("MONGOOSE: connection close");
});

mongoose.connection.on("error", (error) => {
  console.log("MONGOOSE: connection error", error);
});
mongoose.connection.on("error", (error) => {
  console.log("MONGOOSE: connection error", error);
});
