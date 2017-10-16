$(document).ready(function() {

  // Place JavaScript code here...
  IMP.init('imp33162581');
  
  $('#registration-form').on('submit', function(e) {
		e.preventDefault();
    const isInKorea = document.getElementById("livesInKorea").checked ? true : false;
  
    if (isInKorea === false) {
      $('input[name="isPaid"]').val(true);
      $('input[name="paymentId"]').val('');
   		
			// $(this).submit(); // just submit (postRegistration handle it)
			$('#registration-form').unbind('submit').submit();
    } else {
      const email = document.getElementById("email").value;
      const name = document.getElementById("name").value;

      IMP.request_pay({
        pg : 'uplus',
        pay_method : 'card',
        amount : 1000,
        merchant_uid : 'merchant_' + new Date().getTime(),
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
	      	  	email : email,
	      	  	amount : rsp.amount,
	      	  	//기타 필요한 데이터가 있으면 추가 전달
        	  }).done( function(data) {
        	    //[2] 서버에서 REST API로 결제정보확인 및 서비스루틴이 정상적인 경우
							console.log(data);
        	    if ( data.result == 'success' ) {
                $('input[name="isPaid"]').val(true);
                $('input[name="paymentId"]').val(rsp.imp_uid);

								$('#registration-form').unbind('submit').submit();
        	    } else {
        	    	//[3] 아직 제대로 결제가 되지 않았습니다.
        	    	//[4] 결제된 금액이 요청한 금액과 달라 결제를 자동취소처리하였습니다.
                $('input[name="isPaid"]').val(false);
                $('input[name="paymentId"]').val();

      		      alert('결제실패 : 결제된 금액이 요청한 금액과 달라 결제를 자동취소처리하였습니다.' );

      		      return false;
              }
            });
        } else {
          alert('결제실패 : ' + rsp.error_msg);
          $('input[name="isPaid"]').val(false);
          $('input[name="paymentId"]').val('');

      		return false;
        }
      }); // request_pay
    } // isInKorea if statement
  }); // submit event
});
