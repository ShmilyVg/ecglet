// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

  data: {},
  onLoad(options) {
    console.log(options);
    this.dataId = options.dataId;
    Protocol.getPsilnterval({id: this.dataId}).then(data => {

    });
  }
});
