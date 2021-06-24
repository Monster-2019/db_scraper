const mongoose = require('mongoose')
const Schema = mongoose.Schema

const topicSchema = new Schema({
  title: String,
  time: String,
  route: Array,
  subWay: Array,
  direction: Array,
  layout: String,
  sex: String,
  area: String,
  type: String,
  mode: String,
  amount: Array,
  phone: String,
  url: String
})

module.exports = mongoose.model('rent_room_list', topicSchema)