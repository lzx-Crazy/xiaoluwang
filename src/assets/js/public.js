$(function () {
  FastClick.attach(document.body);
});

//获取离顶部高度
function getTop(e){
  var offset=e.offsetTop;
  if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
  return offset;
}

/* 短信验证码 */
var getMsgCode = function (elem) {
  var el = $(elem);
  var count = 60;
  var msgTimed = setInterval(function () {
    el.prop("disabled", true);
    el.text(count + 's');
    count--;
    if (count <= 0) {
      el.prop("disabled", false);
      el.text("获取验证码");
      clearTimeout(msgTimed)
    }
  }, 1000)
}

/* tips消息 */
var showTips = function (msg, sec, callback) {
  var speed = sec != undefined ? sec : 2;
  var _html = "<div class='show-tips'></div>";
  var _el = $(_html);
  $("body").append(_el);
  _el.html("<p>" + msg + "</p >");
  var tipsTimed = setTimeout(function () {
    _el.fadeOut(function () {
      _el.remove();
      if (callback != undefined) {
        callback();
      }
    })
    clearTimeout(tipsTimed)
  }, speed * 1000)
}

// 弹窗滚动优化
var alphaScroll = {
  flagTop: 0,
  addTo: function () {
    this.flagTop = $(window).scrollTop();
    $("html").addClass("alpha");
  },
  removeTo: function () {
    $("html").removeClass("alpha");
    $(window).scrollTop(this.flagTop);
  }
}

/* 显示loading提示 */
var showLoading = function () {
  var _html = "<div class='show-loading'></div>";
  var _el = $(_html);
  $("body").append(_el);
  _el.html("<img src='front/images/icon/icon-loading.png'><p>请稍等...</p>");
  window.addEventListener('click', function (ev) {
    if ($(".show-loading").length > 0) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }, true);
}

/* 关闭loading提示 */
var hideLoading = function () {
  $(".show-loading").fadeOut(function () {
    $(".show-loading").remove()
  })
}

// 设置全局flag 以防用户在触底之后频繁触底
var reachFlag = true;

/* 触底加载 */
var onReachBottom = function (callback) {
  $(document).scroll(function () {
    var doc_hei = $(document).outerHeight(true);
    var sr_top = $(window).scrollTop();
    var win_hei = $(window).outerHeight(true);
    if (win_hei + sr_top + 1 >= doc_hei ) {
      if (!reachFlag) {
        if (!$(".show-loading").length > 0 && !$(".show-tips").length > 0) {
          showTips('暂无更多数据~')
        }
        return false
      }
      reachFlag = false;
      showLoading();
      callback()
    }
  })
}

// 时间戳格式化
var filter = {
  zero: function (num) {
    if (parseInt(num) < 10) {
      num = '0' + num
    }
    return num
  },
  setDate:function(date){
    var that = this;
    var d = new Date(parseInt(date));
    var r = {
      year:d.getFullYear(),
      month:that.zero(d.getMonth() + 1),
      day:that.zero(d.getDate()),
      hour:that.zero(d.getHours()),
      minute:that.zero(d.getMinutes()),
      second:that.zero(d.getSeconds()),
      apm:d.getHours() < 12 ? '上午' : '下午'
    }
    return r;
  },
  dateByApm: function (date) {
    var r = this.setDate(date);
    return r.year + '年' + r.month + '月' + r.day + '日 ' + r.apm + ' ' + r.hour + ':' + r.minute + ':' + r.second
  },
  dateByHms: function (date) {
    var r = this.setDate(date);
    return r.year + '-' + r.month + '-' + r.day + ' ' + r.hour + ':' + r.minute + ':' + r.second
  }
}

// 确认框
function showConfirm(str, cbAccept, cbCancel) {
  var _drop = "<div class='bg-drop'></div>";
  var _html = "<div class='show-confirm'></div>";
  var _el = $(_html);
  var _dl = $(_drop);
  $("body").append(_el);
  $("body").append(_dl);
  var h_cont = "<div class='sc-cont'>" + str + "</div>";
  var h_btn = "<div>" +
    "<button type='button' class='btn-accept'>确定</button>" +
    "<button type='button' class='btn-cancel'>取消</button>" +
    "</div>"
  _el.append(h_cont);
  _el.append(h_btn);
  $(".show-confirm .btn-accept").on("click", function () {
    $(".bg-drop").fadeOut();
    $(".show-confirm").fadeOut(
      function () {
        _dl.remove();
        _el.remove();
        if (cbAccept) {
          cbAccept();
        }
      }
    );
  });
  $(".show-confirm .btn-cancel").on("click", function () {
    $(".bg-drop").fadeOut();
    $(".show-confirm").fadeOut(
      function () {
        _dl.remove();
        _el.remove();
        if (cbCancel) {
          cbCancel();
        }
      }
    );
  });
  _dl.on('click', function (ev) {
    ev.stopPropagation();
    ev.preventDefault();
  });
}


$(function(){
  $(".back-to").on('click',function(){
    window.history.back(-1);
    return false;
  })
})