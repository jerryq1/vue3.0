<template>
  <div>
    <div class="product">
      <div class="product-image" v-if="images.length>0">
        <img :src="mainImage">
        <div class="images">
          <div v-for="(item,index) in images" :index="index" class="image" @click="changeImage(item.imageUrl)">
            <img :src="item.imageUrl" alt="">
          </div>
        </div>
      </div>
      <div class="product-info">
        <h1 class="product-name">{{ product.title}}</h1>
        <div class="product-cost">¥ {{ product.salePrice }}</div>
        <div v-for="(item,index) in attrList" class="attDiv">
          <div>{{item.name}}</div>
          <div v-for="(_item,_index) in item.attKeyValueList" class="box" :disabled="!_item.enable"
               :class="[{'disabled':_item.enable == false},{'active':_item.select==true}]"
               @click="onChangeShowState(index,_index)">
            {{_item.name}}
          </div>
        </div>
        <!--        <div class="product-add-cart" @click="handleAddToCart">加入购物车</div>-->
      </div>
    </div>
    <div class="product-desc">
      <h2>产品介绍</h2>
      <img v-for="(item,index) in bgcImage" :src="item" :index="index">
    </div>
  </div>
</template>
<script>
  import * as api from '@/axios.js'

  export default {
    data() {
      return {
        // 获取路由中的参数
        id: parseInt(this.$route.params.id),
        product: {
          title: '',
          salePrice: null
        },
        images: [],
        mainImage: '',
        value: '',
        bgcImage: [],
        attrList: [],
        skuBeanList: []

      }
    },
    methods: {
      getProductArr() {

      },
      getProductDetailInfo() {
        api.getProductDetail({productId: this.$route.query.productId}).then((res) => {
          this.product = res.data
          this.images = res.data.productImagesModuleList
          this.mainImage = res.data.productImagesModuleList[0].imageUrl
          console.log(res);
        }).catch((err) => {
          // this.printTips(err, 'error')
        })
      },
      changeImage(image) {
        this.mainImage = image
      },
      getImages() {
        let imgs = this.value.match(/<img[^>]+>/g)
        let that = this
        imgs.forEach(i => {
          i.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
            that.bgcImage.push(capture)
          });
        })

        console.log(imgs, this.bgcImage)

      },
      getImage() {
        api.getProductImages({productId: this.$route.query.productId}).then((res) => {
          this.value = res.data[0].value
          this.getImages()
          console.log(res);
        }).catch((err) => {
          // this.printTips(err, 'error')
        })
      },
      async init(){
        await this.getProSku()
        await this.skuInit()
      },
      skuInit() {
        let skudefaultIdArr = (this.skuBeanList[0] && this.skuBeanList[0].attributeModelList) ? JSON.parse(JSON.stringify(this.skuBeanList[0].attributeModelList.map(item => item.attributeValId))) : []
        console.log(this.skuBeanList[0])

        this.attrList.forEach(item => {
          item.attKeyValueList.forEach(_item => {
            // _item.enable = true
            if (skudefaultIdArr.includes(_item.id)) {
              _item.select = true
              // canGetInfoLog += `"${_item.name}"` + " "
            } else {
              _item.select = false
            }
          })
        })
        this.product.salePrice = this.skuBeanList[0].salePrice
        this.mainImage = this.skuBeanList[0].skuImagesList[0]

      },
      // sku
      getProSku() {

        return api.getProductInfo({productId: this.$route.query.productId}).then((res) => {
          console.log(res.data)
          let newArrList = JSON.parse(JSON.stringify(res.data.attributeModelList))
          newArrList.forEach(item => {
            item.attKeyValueList.forEach(_item => {
              _item.enable = _item.isOnSales
              _item.select = false
              _item.attributeId = _item.cateAttrId
            })
          })


          let newSkuBeanList = JSON.parse(JSON.stringify(res.data.skuMobileDetailModelList))
          newSkuBeanList.forEach(item => {
            item.attributeModelList.forEach(_item => {
              _item.attributeId = _item.id
              _item.attributeValId = _item.attKeyValueList[0].id
            })
          })
          this.attrList = newArrList
          this.skuBeanList = newSkuBeanList
          this.onData();
        }).catch((err) => {
          // this.printTips(err, 'error')
        })
      },
      /**
       * Sku核心算法
       * 根据所有出当前类别之外的选择 判断按钮的enable ？ false or true
       */
      onData() {

        var attrListIn = this.attrList;

        console.log(this.attrList, "待扫描 列表清单");
        console.log(this.skuBeanList, "待扫描 库存清单");

        for (var i = 0; i < attrListIn.length; i++) {
          var attrListBig = attrListIn[i];

          //当前类别之外的选择列表
          var attrsOtherSelect = [];
          for (var j = 0; j < attrListIn.length; j++) {
            var attrListSmall = attrListIn[j];
            if (attrListSmall.id != attrListBig.id) {
              for (var k = 0; k < attrListSmall.attKeyValueList.length; k++) {
                var attrListSmallAttr = attrListSmall.attKeyValueList[k];
                if (attrListSmallAttr.enable && attrListSmallAttr.select) {
                  attrsOtherSelect.push(attrListSmallAttr);
                }
              }
            }
          }

          var enableIds = [];

          var skuBeanListIn = this.skuBeanList;

          for (var z = 0; z < skuBeanListIn.length; z++) {
            var ism = true;
            var skuBean = skuBeanListIn[z];

            for (var j = 0; j < attrsOtherSelect.length; j++) {
              var enable = false;
              for (var k = 0; k < skuBean.attributeModelList.length; k++) {

                var goodAttrBean = skuBean.attributeModelList[k];

                if (attrsOtherSelect[j].attributeId == goodAttrBean.attributeId &&
                  attrsOtherSelect[j].id == goodAttrBean.attributeValId) {
                  enable = true;
                  break;
                }
              }
              ism = enable && ism;
            }

            if (ism) {
              for (var o = 0; o < skuBean.attributeModelList.length; o++) {
                var goodAttrBean = skuBean.attributeModelList[o];

                if (attrListBig.id == goodAttrBean.attributeId) {
                  enableIds.push(goodAttrBean.attributeValId);
                }
              }
            }
          }

          console.log(enableIds, "sku算法 扫描结果");

          var integers = enableIds;
          for (var s = 0; s < attrListBig.attKeyValueList.length; s++) {
            var attrItem = attrListBig.attKeyValueList[s];

            attrItem.enable = integers.indexOf(attrItem.id) != -1;

          }
        }

        // 重新赋值
        this.attrList = attrListIn
        this.skuBeanList = skuBeanListIn
      },

      /**
       * 规格属性点击事件
       */
      onChangeShowState(index, _index) {

        // console.log(event, 'event')
        //   debugger
        let listItem = this.attrList;
        let items = listItem[index];
        let item = items.attKeyValueList[_index];
        // console.log(items, 'item.enables')
        // console.log(items.attKeyValueList, 'item.enable')
        // console.log(item, event.currentTarget.dataset.index)
        if (!item.enable) {
          return;
        }

        var select = !item.select;

        for (var i = 0; i < items.attKeyValueList.length; i++) {
          items.attKeyValueList[i].select = false;
        }

        item.select = select;

        // 获取点击属性列表
        var canGetInfo = [];
        for (var skuIndex = 0; skuIndex < listItem.length; skuIndex++) {
          for (var skuIndexIn = 0; skuIndexIn < listItem[skuIndex].attKeyValueList.length; skuIndexIn++) {
            if (listItem[skuIndex].attKeyValueList[skuIndexIn].enable && listItem[skuIndex].attKeyValueList[skuIndexIn].select) {
              canGetInfo.push(listItem[skuIndex].attKeyValueList[skuIndexIn]);
            }
          }
        }

        console.log(canGetInfo, "目前点击的属性");

        var canGetInfoLog = "";

        var skuBeanList = this.skuBeanList;

        var haveSkuBean = [];
        // 对应库存清单扫描
        for (var skuBeanIndex = 0; skuBeanIndex < skuBeanList.length; skuBeanIndex++) {
          var iListCount = 0;
          for (var skuBeanIndexIn = 0; skuBeanIndexIn < skuBeanList[skuBeanIndex].attributeModelList.length; skuBeanIndexIn++) {
            if (canGetInfo.length == skuBeanList[skuBeanIndex].attributeModelList.length) {
              if (skuBeanList[skuBeanIndex].attributeModelList[skuBeanIndexIn].attributeValId == canGetInfo[skuBeanIndexIn].id) {
                iListCount++;
              }
            } else {
              //   canGetInfoLog = "库存清单不存在此属性" + " ";
            }
          }
          if (iListCount == skuBeanList[skuBeanIndex].attributeModelList.length) {
            haveSkuBean.push(skuBeanList[skuBeanIndex]);
          }
        }

        console.log(haveSkuBean, "存在于库存清单");

        for (var iox = 0; iox < canGetInfo.length; iox++) {
          canGetInfoLog += `"${canGetInfo[iox].name}"` + " ";
        }


        let skuPrice, skuCount, commission, skuMsg;
        let confirOrderObj = {
          productId: null,
          brandId: null,
          skuId: null,
          buyNum: null,
          warehouseId: null,
          barCode: null
        }
        // 获取库存量
        // 获取真实价格
        if (haveSkuBean.length != 0) {
          //   canGetInfoLog += "价钱:" + haveSkuBean[0].price + " 库存量:" + haveSkuBean[0].count;
          skuPrice = haveSkuBean[0].salePrice
          // skuCount = haveSkuBean[0].totalInventory
          // skuMsg = haveSkuBean[0].inventoryMsg
          // confirOrderObj.skuId = haveSkuBean[0].id
          // confirOrderObj.warehouseId = `${haveSkuBean[0].wareHouseId}`
          // confirOrderObj.barCode = haveSkuBean[0].barcode
          // confirOrderObj.productId = haveSkuBean[0].productId
          // confirOrderObj.buyNum = this.data.modalProductInfo.value
          // confirOrderObj.brandId = haveSkuBean[0].brandId
          // commission = haveSkuBean[0].commission
          // if (haveSkuBean[0].overloadMsg) util.toast(haveSkuBean[0].overloadMsg)
          this.mainImage = haveSkuBean[0].skuImagesList[0]

        } else {
          skuPrice = this.product.salePrice
          // skuCount = this.data.proDuctInfo.totalInventory
          // skuMsg = this.data.proDuctInfo.inventoryMsg
        }
        console.log(confirOrderObj, 'confirOrderObj')

        // // 重新赋值
        // this.setData({
        //   attrList: listItem,
        //   'modalProductInfo.productDesc': canGetInfoLog,
        //   'modalProductInfo.productPrice': skuPrice,
        //   'modalProductInfo.stock': skuCount,
        //   'modalProductInfo.inventoryMsg': skuMsg,
        //   'modalProductInfo.commission': commission,
        //   confirOrderObj
        // })
        this.product.salePrice = skuPrice

        // 重新sku运算
        this.onData();
      },
    },
    mounted() {
      this.getProductArr();
      this.getProductDetailInfo()
      this.getImage()
      this.init()
    }
  }
</script>
<style lang="scss" scoped>
  .product {
    margin: 32px;
    padding: 32px;
    background: #fff;
    border: 1px solid #dddee1;
    border-radius: 10px;
    overflow: hidden;

    .product-name {
      font-size: 40px;
      font-weight: bold;
    }

    .product-cost {
      font-size: 40px;
      font-weight: bold;
      color: #f2352e;
      margin: 8px 0;
      /*background-color: darksalmon;*/
    }
  }

  .product-image {
    width: 450px;
    height: 450px;
    float: left;
    text-align: center;
  }

  .product-image img {
    height: 100%;
  }

  .product-info {
    width: 50%;
    margin-left: 20px;
    padding-bottom: 400px;
    height: 150px;
    float: left;
    /*text-align: center;*/
  }

  .product-add-cart {
    display: inline-block;
    padding: 8px 64px;
    margin: 8px 0;
    background: #2d8cf0;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  .product-desc {
    background: #fff;
    margin: 32px;
    padding: 32px;
    border: 1px solid #dddee1;
    border-radius: 10px;
    text-align: center;
  }

  .product-desc img {
    display: block;
    width: 50%;
    margin: 32px auto;
    padding: 32px;
    border-bottom: 1px solid #dddee1;
  }


  .images {
    display: flex;
    margin-top: 20px;

    .image {
      width: 50px;
      height: 50px;
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
      /*border: 1px solid #000;*/
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .attDiv {
    height: 50px;

    div {
      display: inline-flex;
      margin-right: 5px;

      &.box {
        border: 1px solid #888;
        padding: 5px;
        cursor: pointer;
      }

      &.active {
        background: #fff2f3;
        color: #f2303d;
      }

      &.disabled {
        background: #f3f3f3;
        color: #bfbfbf;
        cursor: not-allowed;
      }
    }
  }

</style>
