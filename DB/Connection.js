const mongoose = require("mongoose");

const connection = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mycluster.zktl9fh.mongodb.net/?retryWrites=true&w=majority&appName=mycluster`
  );
};
module.exports = connection;
