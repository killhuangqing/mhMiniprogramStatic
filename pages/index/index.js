//index.js
var wxApi = require("../../utils/util.js");

Page({
      data: {
          isBoy:false,   //男版
          isGirl:false,   //女版
          timer:null,     //倒计时
          imgUrls:[],
          title:[],
          keyIndex:[],
          indicatorDots: true, //是否显示指示点
          autoplay: true, //是否自动切换
          interval: 3000, //自动切换间隔时长
          duration: 500, //滑动动画时长
          indicatorColor:'#fff',   //指示点颜色
          indicatorActiveColor:'#FFCC33',   //当前选中指示点颜色
          circular:true,  //衔接滑动
          vertical: false,  //滑动方向是否纵向
          networkType:true,  //是否有网络
          isScroll:true,   //scroll-view滚动条
          isOpacity:false,  //蒙层
          listData:false,    //搜索显示隐藏
          isScrollSearch:false,    //滚动
          searchListData:[],
          inputValue:'',
          isToast:false,   //男女分版切换toast
          id:0,
          idg:1,
          searchList:[],   //搜索列表
          scrolType:'',
          message:'',    //提示语
          total:1,    //总页码
          noSearch:true,   //是否有搜索结果
          isLoad:false,     //是否加载失败
      },
      metaData:{
        mca:''
      },
    searchData:{
       word:'',
       page_num:1,
       rows_num:20
    },

    initData: function () {
        var that = this;
        var mca = '';
        if (!!this.metaData.mca){
            mca = this.metaData.mca;
        }
        wxApi.recommendList({
            method:'GET',
            data:{mca},
            header:'application/html',
            success:function (data) {
                //console.log(data)
                var site_image = data.data.data.site_image;
                var location_list = data.data.data.location_list;
                console.log(location_list);
                var recommendList = {};
                var title= that.data.title,keyIndex = that.data.keyIndex;
                if (data.data.code == 1){
                    if (that.data.id === 0 || that.data.id === 1){
                        //recommendList = {};
                        title = [];
                        keyIndex = [];
                    }
                    location_list.forEach((item,index)=> {
                        //console.log(item.location_en);
                        var key = item.location_en;
                        recommendList[key] = data.data.data[key];
                        //console.log(data.data.data[key]);
                        title.push(item.location_cn);
                        keyIndex.push(key)
                    });
                    console.log('recommendList', recommendList);
                    const imgUrls = recommendList[mca+'_rotation_map'];
                    //精品佳作
                    const FineWorks = recommendList[mca+'_fine_works'];
                    //人气作品
                    const PopularWorks = recommendList[mca+'_popular_works'].slice(0,4);
                    //最新上架
                    const newArrivalWorks = recommendList[mca+'_new_arrival'].slice(0,3);
                    //热门连载
                    const hotSerialWorks = recommendList[mca+'_hot_serial'].slice(0,4);
                    const xiaobianRecommend = recommendList[mca+'_xiaobian_recommend'].slice(0,3);
                    const weekRecommend = recommendList[mca+'_week_recommend'].slice(0,4);
                    that.setData({
                        keyIndex:keyIndex,
                        title_fine:title[1],
                        title_hot:title[2],
                        title_new:title[3],
                        title_hotserial:title[4],
                        title_xbrecommend:title[5],
                        title_weekrecommend:title[6],
                        imgUrls,
                        FineWorks,
                        PopularWorks,
                        newArrivalWorks,
                        hotSerialWorks,
                        xiaobianRecommend,
                        weekRecommend,
                        isToast:false,
                        networkType:true
                    })

                }

            },
            fail:function (data) {
                that.setData({
                    networkType:true,
                    isLoad:true
                })
            }
        })

    },
    searchDatas:function () {
        var that = this;
        var page_num = '',rows_num='',word='';
        if (!!this.searchData.word){
            word = this.searchData.word;
        }
        if (!!this.searchData.page_num) {
            page_num = +this.searchData.page_num;
        }
        if (!!this.searchData.rows_num){
            rows_num = this.searchData.rows_num;
        }
        if (page_num >that.data.total){
            return;
        }else {
            wxApi.searchList({
                method:'GET',
                data:{word,rows_num,page_num},
                header:'',
                success:function (data) {
                    if (data.data.data.data.length !==0){
                        //console.log(data.data);
                        that.data.total = data.data.data.page_total;
                        var site_cover = data.data.data.site_cover;

                        if (that.data.scrolType !== ''){
                            data.data.data.data.forEach((item,index) =>{
                                //判断图片路径是否带有https||http前缀，有则什么都不做，没有加上
                                if (item.cover && !/^http[s]?:\/\//ig.test(item.cover)){
                                    item.cover = site_cover + item.cover;
                                }
                            })
                            var searchList = that.data.searchList.concat(data.data.data.data);
                            //console.log(searchList);

                        }else {
                            that.data.searchList = data.data.data.data;
                            that.data.searchList.forEach((item,index) =>{
                                //判断图片路径是否带有https||http前缀，有则什么都不做，没有加上
                                if (item.cover && !/^http[s]?:\/\//ig.test(item.cover)){
                                    item.cover = site_cover + item.cover;
                                }
                            })
                            var searchList = that.data.searchList;
                            //console.log(searchList);
                        }
                        that.setData({
                            searchList:searchList,
                            inputValue: word,
                            listData:true,
                            isScroll:false,
                            message: that.data.total > page_num ? '加载更多...' : '没有更多了',//提示语
                            networkType:true,
                            noSearch:true
                        })
                    }else if (data.data.data.data.length === 0){//搜索没有匹配的数据时提示图
                        that.setData({
                            searchList:[],
                            noSearch:false
                        })
                    }
                },
                fail:function (data) {
                    that.setData({
                        networkType:true,
                        isLoad:true
                    })
                }

            });
        }



    },

    /*事件处理函数*/
    /*boy and girl*/
    onBoyTap:function (event) {
        var that = this;
        var boyid=event.currentTarget.dataset.index;
        //console.log(boyid);
        this.setData({
            isBoy:!that.data.isBoy

        });
        that.data.timer = setTimeout(function () {
            that.setData({
                boyid:boyid
            })
        },1000);
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                if (boyid) {
                    this.metaData.mca = "h5_recommend_male";
                    this.initData();
                }
                //#############本地存储############//
                wx.setStorage({
                    key:'id',
                    data:boyid,
                    success:function (res) {
                        //console.log(res);
                    }
                })
            }
        }).catch((err) =>{
            this.setData({
                networkType:true,
                isLoad:true
            })
        })

    },

    onGirlTap:function (event) {
        var that = this;
        var girlid=event.currentTarget.dataset.index;
        //console.log(girlid);
        this.setData({
            isGirl:!that.data.isGirl,
            idsed:3
        });
        that.data.timer = setTimeout(function () {
            that.setData({
                girlid:girlid
            })
        },1000);
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                if(girlid){
                    this.metaData.mca = "h5_recommend_female";
                    this.initData();
                }
                //#############本地存储############//
                wx.setStorage({
                    key:'id',
                    data:girlid,
                    success:function (res) {
                        //console.log(res);
                    }
                })
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })
    },
    //banner跳转详情
    swipTap:function (e) {
        var comic_id = e.currentTarget.dataset.typeid;
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },
    /*input聚焦和失焦,监听*/
    focusInputEvent: function () {
          var that= this;
        this.setData({
            isOpacity: true,
            isScroll:false
        })
    },
    blurInputEvent: function () {
          var that = this;
        this.setData({
            isOpacity:false,
            isScroll:true
        })
    },
    bindInputChange:function (e) {
        var that = this;
         that.searchData.word = e.detail.value;
        //console.log(that.searchData.word);
        var word = that.searchData.word;//判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                if (word === ''){
                    this.setData({
                        searchList:[],
                        noSearch:true
                    })
                    that.data.scrolType = '';
                    that.searchData.page_num = 1;
                }else {
                    that.setData({
                        isScroll:false
                    })
                    that.searchDatas();
                }
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },
    //删除搜索框内容事件
    onDel:function () {
        var that = this;
        this.setData({
            inputValue:'',
            searchList:[],
            noSearch:true   //关闭提示重新搜索
        });
        that.data.scrolType = '';
        that.searchData.page_num = 1;
    },
    //取消
    onCancel:function(){
        var that = this;
        this.setData({
            isOpacity:false,
            listData:false,
            isScroll:true,
            inputValue:'',
            searchList:[],
            noSearch:true,

        });
        that.data.scrolType = '';
        that.searchData.page_num = 1;
    },
    /*查看更多*/
    bindMoreTap:function (e) {
        var location_en = e.currentTarget.dataset.index;
        var title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: '/pages/morelist/morelist?location_en='+location_en+'&title='+title
        })
    },

    //滚动条滚到顶部的时候触发
    upper: function(e) {

    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        //console.log(e.type);
        var that = this;
        that.data.scrolType = e.type;
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                that.searchData.page_num++;
                that.searchDatas();
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },
    //滚动条滚动后触发
    scroll: function(e) {
        var that = this;
        var scrollTop = e.detail.scrollTop;
        if (scrollTop >67){
            this.setData({
                isScrollSearch:true
            })
        }
        if (scrollTop === 0){
            this.setData({
                isScrollSearch:false
            })

        }
    },

    onLoad: function (options) {
        var that = this;
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                //########### 获取初次男女分版存储 ##############//
                wx.getStorage({
                    key:'id',
                    success:function (res) {
                        //console.log(res.data);
                        var data = res.data;
                        //console.log(data);
                        if (data === "0"){
                            that.setData({
                                boyid:"0"
                            });
                            that.metaData.mca = "h5_recommend_male";
                            that.initData();
                        }else  if (data === "1"){
                            that.setData({
                                girlid:"1"
                            });
                            that.metaData.mca = "h5_recommend_female";
                            that.initData();
                        }
                    }
                });

                //################# 获取推荐页男女选择存储 #########################//
                wx.getStorage({
                    key:'id',
                    success:function (res) {
                        //console.log(res);
                        var id = res.data;
                        if (id === 0){
                            that.metaData.mca = "h5_recommend_female";
                            that.initData();
                            that.setData({
                                id:1,
                                idg : 1,
                                boyid:"0"
                            })
                        }else if (id === 1){
                            that.metaData.mca = "h5_recommend_male";
                            that.initData();
                            that.setData({
                                id:0,
                                idg : 0,
                                girlid:"1"
                            })
                        }

                    }
                });
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },

    //男女分版切换
    onToastTap:function (e) {
        var that = this;
        that.data.id = Number(e.currentTarget.dataset.id);
        var id = that.data.id;
        //console.log(id);
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                if (id === 0){
                    this.setData({
                        imgUrls:[]
                    })
                    this.metaData.mca = "h5_recommend_female";
                    this.initData();
                    this.setData({
                        isToast:true,
                        id : 1
                    })
                }else  if (id === 1){
                    this.setData({
                        imgUrls:[]
                    })
                    this.metaData.mca = "h5_recommend_male";
                    this.initData();
                    this.setData({
                        isToast:true,
                        id : 0
                    })
                }
                //#############本地存储############//
                wx.setStorage({
                    key:'id',
                    data:id,
                    success:function (res) {
                        //console.log(res);
                    }

                })
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },
    onToastTap02:function (e) {
        var that = this;
        that.data.idg = Number(e.currentTarget.dataset.id);
        var idg = that.data.idg;
        //console.log(idg);
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                if (idg === 1){
                    that.setData({
                        imgUrls:[]
                    })
                    this.metaData.mca = "h5_recommend_male";
                    this.initData();
                    this.setData({
                        isToast:true,
                        idg : 0
                    })
                }
                else if (idg === 0){
                    this.setData({
                        imgUrls:[]
                    })
                    this.metaData.mca = "h5_recommend_female";
                    this.initData();
                    that.setData({
                        isToast:true,
                        idg : 1
                    })
                }
                //#############本地存储############//
                wx.setStorage({
                    key:'id',
                    data:idg,
                    success:function (res) {
                        //console.log(res);
                    }
                })
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
        this.searchlist = this.selectComponent("#searchlist");
    },
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }

})
