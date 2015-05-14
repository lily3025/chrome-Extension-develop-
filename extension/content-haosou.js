var url = 'http://www.amap.com/#!poi!!q=';
var city = '';

$.get('http://restapi.map.haosou.com/api/simple?sid=7001&x=' + $('input[name=userX]').val() + '&y=' + $('input[name=userY]').val() + '&jsoncallback=&number=0&show_addr=true&formatted=true&src=guangjiebao',
function(data){
    city = data.regeocode.addressComponent.city || data.regeocode.addressComponent.city_name;
});
$('.hasGeo #distance').after('<label class="control-label"><button type="button" class="btn btn-info" id="getxybyaddr">GEO</button></label>');

$('#getxybyaddr').on('click', function() {
    var addr = $('#shopName').val();
    chrome.runtime.sendMessage({
        url: url + encodeURIComponent(city + ' ' + addr)
    }, function(response) {
      console.log(response);
    });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.longitude) {
      $('input[name=shopX]').val(request.longitude);
      $('input[name=shopY]').val(request.latitude);
    } else if (request.address) {
      var $address = $('input[name=shopAddress]'),
          $shop = $('#shopName');
      $address.val(request.address);
      if (!$shop.val()) {
        $('input[name=shopName]').val(request.title);
      }
    }

    var shopX = $('#shopX').val(),
        shopY = $('#shopY').val(),
        userX = $('#userX').val(),
        userY = $('#userY').val();
    if (shopX && shopY && userX && userY) {
        $.ajax({
            url: '/infoService/computeDistance?',
            data: {
                shopX: shopX,
                shopY: shopY,
                userX: userX,
                userY: userY
            },
            type:  'get',
            dataType: 'json',
            success: function(obj) {
                if (obj.data.distance) {
                    $('#distance').html('距离' + obj.data.distance.toFixed(2) + '米');
                    if (obj.data.distance > 100000) {
                        $('#distance').addClass('far');
                    }
                }
            }
        });
    }
  });
