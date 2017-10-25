$(document).ready(function() {

  // Place JavaScript code here...
  IMP.init('imp33162581');
  
  $('#registration-form').on('submit', function(e) {
		e.preventDefault();
    const isInKorea = document.getElementById("livesInKorea").checked ? true : false;
  
    if (isInKorea === false) {
      $('input[name="isPaid"]').val(true);
      $('input[name="paymentImpUId"]').val();
      $('input[name="paymentMctUId"]').val();

			// $(this).submit(); // just submit (postRegistration handle it)
			$('#registration-form').unbind('submit').submit();
    } else {
      const email = document.getElementById("email").value;
      const name = document.getElementById("name").value;
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
       // mobile payment
       var msg = "모바일 결제는 지원되지 않습니다.";
       alert(msg);

       return false;
       // IMP.request_pay({
       //   pg : 'uplus',
       //   pay_method : 'card',
       //   m_direct_url : 'http://ws2018-ticket.mediviewsoft.com/mobile/payment',
       //   amount : 1000,
       //   merchant_uid : 'ws2018pay_' + new Date().getTime(),
       //   buyer_name : name,
       //   buyer_email : email,
       //   name : 'Winterschool 2018'
       // });
      } else {
        IMP.request_pay({
          pg : 'uplus',
          pay_method : 'card',
          amount : 1000,
          merchant_uid : 'ws2018pay_' + new Date().getTime(),
          buyer_name : name,
          buyer_email : email,
          name : 'Winterschool 2018'
        }, function(rsp) {
          //결제 후 호출되는 callback함수
        	if ( rsp.success ) { //결제 성공
            $.ajaxSetup({
              beforeSend: function(xhr) {
			  				var csrf_token = $('input[name="_csrf"]').attr('value');
          			xhr.setRequestHeader("X-CSRF-Token", csrf_token);
              }
            });
            $.post(
              "/payment/complete", //cross-domain error가 발생하지 않도록 동일한 도메인으로 전송
          	  {
          	    status : rsp.status,
	        	  	imp_uid : rsp.imp_uid,
	        	  	merchant_uid : rsp.mechant_uid,
	        	  	email : email,
	        	  	amount : rsp.amount,
	        	  	//기타 필요한 데이터가 있으면 추가 전달
          	  }).done(function(data) {
          	    //[2] 서버에서 REST API로 결제정보확인 및 서비스루틴이 정상적인 경우
			  				console.log(data);
          	    if ( data.result == 'success' ) {
                  $('input[name="isPaid"]').val(true);
                  $('input[name="paymentImpUId"]').val(rsp.imp_uid);
                  $('input[name="paymentMctUId"]').val(rsp.merchant_uid);
                
                  var msg = '결제가 완료되었습니다.';
    	  		      msg += '\n고유ID : ' + rsp.imp_uid;
    	  		      msg += '\n상점 거래ID : ' + rsp.merchant_uid;
    	  		      msg += '\n결제 금액 : ' + rsp.paid_amount;
    	  		      msg += '\n카드 승인번호 : ' + rsp.apply_num;

    	  		      alert(msg);

			  					$('#registration-form').unbind('submit').submit();
          	    } else {
          	    	//[3] 아직 제대로 결제가 되지 않았습니다.
          	    	//[4] 결제된 금액이 요청한 금액과 달라 결제를 자동취소처리하였습니다.
                  var msg = '결제가 완료되지 않았습니다.';
    	  		      msg += '결제된 금액이 요청한 금액과 달라 결제를 자동취소처리하였습니다.'

    	  		      alert(msg);

                  $('input[name="isPaid"]').val(false);
                  $('input[name="paymentImpUId"]').val();
                  $('input[name="paymentMctUId"]').val();

        		      alert('결제실패 : 결제된 금액이 요청한 금액과 달라 결제를 자동취소처리하였습니다.' );

        		      return false;
                } // data.result == 'success'
              }); // $.post
          } else {
            var msg = '결제에 실패하였습니다.';
            msg += '\n에러내용 : ' + rsp.error_msg;

            alert(msg);

            $('input[name="isPaid"]').val(false);
            $('input[name="paymentImpUId"]').val();
            $('input[name="paymentMctUId"]').val();

        		return false;
          }
        }); // request_pay
      } // mobile check
    } // isInKorea if statement
  }); // submit event

  return false;
});
