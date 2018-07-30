// pages/rankinglist/rankinglist.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      statusList:[
          {
              status:0,
              title:'阅读榜'
          },
          {
              status:1,
              title:'新作榜'
          },
          {
              status:2,
              title:'综合榜'
          }
      ],
      status:0,
      windowHeight:'',
      networkType:true,  //是否有网络
      isLoad:false,     //是否加载失败
      hasData:true,     //是否有内容
  },
    /*阅读榜数据*/
    readList:function () {
        var that = this;
        wxApi.readList({
                method:'GET',
                success:function (data) {
                    console.log(data.data.data.week);
                    if (data.data.data.week.length !== 0) {
                        let readData=[];
                        data.data.data.week.forEach((item,index) => {
                            readData.push(item);
                            that.setData({
                                index:index
                            })
                        });
                        that.setData({
                            readData,
                            type:null,
                            hasData:true
                        })
                    }else if (data.data.data.week.length === 0) {
                        that.setData({
                            type:null,
                            readData:[],
                            hasData:false
                        })
                    }

                },
                fail:function (data) {
                    that.setData({
                        networkType: true,
                        isLoad:true
                    })
                }
        })


    },
    /*新作榜数据*/
    newList:function () {
        var that = this;
      wxApi.newList({
          method:'GET',
          success:function (data) {
              console.log(data.data.data.week);
              if (data.data.data.week.length !== 0) {
                  let newData = [];
                  data.data.data.week.forEach((item,index) => {
                      newData.push(item);
                      that.setData({
                          index:index
                      })
                  });
                  that.setData({
                      newData,
                      type:null,
                      hasData:true
                  })
              }else  if (data.data.data.week.length === 0) {
                that.setData({
                    type:null,
                    newData:[],
                    hasData:false
                })
              }

          },
          fail:function (data) {
              this.setData({
                  networkType: true,
                  isLoad:true
              })
          }
      })
    },
    /*综合榜数据*/
    rankList:function () {
        var that = this;
        wxApi.rankList({
            method:'GET',
            success:function (data) {
                console.log(data.data.data.week);
                if (data.data.data.week.length !== 0) {
                    let rankData = [];
                    data.data.data.week.forEach((item,index) => {
                        rankData.push(item);
                        that.setData({
                            index:index
                        })
                    });
                    that.setData({
                        rankData,
                        type:null,
                        hasData:true
                    })
                }else if (data.data.data.week.length === 0) {
                    that.setData({
                        type:null,
                        rankData:[],
                        hasData:false
                    })
                }

            },
            fail:function (data) {
                this.setData({
                    networkType: true,
                    isLoad:true
                })
            }
        })
    },


    /*tab事件*/
    onTabTap: function (event) {
        //console.log(event)
        var that = this;
        var status = event.currentTarget.dataset.id;
        if (that.data.status == status){
            return;
        }else {
            this.setData({
                status :event.currentTarget.dataset.id
            });
            wxApi.getNetworkType().then((res) =>{
                let networkType = res.networkType;
                if (networkType === 'none' || networkType === 'unknown') {
                    //无网络不进行任何操作
                    this.setData({
                        networkType: false,
                        readData:[],
                        newData:[],
                        rankData:[]
                    });

                }else {
                    //有网络
                    if (status === 0) {
                        that.setData({
                            type:'loading',
                            readData:[],
                        })
                        that.readList();
                    }
                    else if (status === 1) {
                        that.setData({
                            type:'loading',
                            newData:[],
                        })
                        that.newList();
                    }
                    else if (status === 2) {
                        that.setData({
                            type:'loading',
                            rankData:[],
                        })
                        that.rankList();
                    }

                }
            }).catch((err) =>{
                this.setData({
                    networkType: true,
                    isLoad:true
                })
            })
        }

    },
    /*** 滑动切换tab***/
    bindChange: function (e) {
        //console.log(e)
        let currentId = e.detail.current;
        let source = e.detail.source;
        var that = this;
        that.setData({
            status: currentId
        });
        if (source) {
            wxApi.getNetworkType().then((res) =>{
                let networkType = res.networkType;
                if (networkType === 'none' || networkType === 'unknown') {
                    //无网络不进行任何操作
                    this.setData({
                        networkType: false,
                        readData:[],
                        newData:[],
                        rankData:[]
                    })

                }else {
                    //有网络
                    if (currentId === 0) {
                        that.readList();
                    }
                    else if (currentId === 1) {
                        that.newList();
                    }
                    else if (currentId === 2) {
                        that.rankList();
                    }

                }
            }).catch((err) =>{
                this.setData({
                    networkType: true,
                    isLoad:true
                })
            })
        }

    },
    /*页面跳转*/
    readTap:function (event) {
        var comic_id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },
    newTap:function (event) {
        var comic_id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },
    rankTap:function (event) {
        var comic_id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      //  高度自适应
      wx.getSystemInfo( {
          success: function( res ) {
              var clientHeight=res.windowHeight,
                  clientWidth=res.windowWidth,
                  rpxR=750/clientWidth;
              var  calc=clientHeight*rpxR;
              that.data.windowHeight = calc;
              that.setData({
                  windowHeight: that.data.windowHeight
              });
          }
      });
      wxApi.getNetworkType().then((res) =>{
          let networkType = res.networkType;
          if (networkType === 'none' || networkType === 'unknown') {
              //无网络不进行任何操作
              this.setData({
                  networkType: false,
              })

          }else {
              //有网络
              that.setData({
                  type:'loading',
              })
              that.readList();

          }
      }).catch((err) =>{
          this.setData({
              networkType: true,
              isLoad:true
          })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
          title: '各种有爱的动漫分享'
      }
  }
})