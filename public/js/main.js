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
          amount : 250000,
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
                }, // data.result == 'success'
                dataType: 'json'
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

  $('#ticket-form').on('submit', function(e) {
		e.preventDefault();

    if ($('#isPaid-val').text() === 'Yes') {
      var paymentStatus = 'Yes';
      if ($('#isKorean-val').text() === 'Yes') {
        var paymentAmount = '250,000 KRW';
      } else {
        var paymentAmount = '0 KRW';
      }
    } else {
      var paymentAmount = '0 KRW';
      var paymentStatus = 'No';
    }

    var columns = [
      {title: "Name", dataKey: "name"},
      {title: "Content", dataKey: "content"}, 
    ]; 
    var rows = [
      {"name": 'Name', "content": $('#name').val()},
      {"name": 'Email', "content": $('#email-val').text()},
      {"name": 'Nationality', "content": $('#nationality').val()},
      {"name": 'Affiliation', "content": $('#affiliation').val()},
      {"name": 'Position', "content": $('#position').val()},
      {"name": 'Registration Fee', "content": paymentAmount},
    ]

    var doc = new jsPDF('p', 'pt');
    // doc.addFont("PT-Sans", "PT Sans", "normal");
    // doc.addFont("PT-Sans", "PT Sans", "bold");

    // doc.setFont("PT-Sans", "bold");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    doc.text('3rd CSE Winter School 2018', doc.internal.pageSize.width / 2, doc.internal.pageSize.height * 0.13, 'center');

    doc.setFont("Helvetica", "normal");
    // doc.setFont("PT-Sans", "normal");
    doc.setFontSize(18);
    doc.text('Main Topic : Computational Science & Machine Learning', doc.internal.pageSize.width / 2, doc.internal.pageSize.height * 0.2, 'center');

    doc.setFontSize(14);
    doc.text('January 8 - 11, 2018', doc.internal.pageSize.width / 2, doc.internal.pageSize.height * 0.23, 'center');
    doc.text('SonofelIce, Hongcheon-gun, Gangwon-Do, South Korea', doc.internal.pageSize.width / 2, doc.internal.pageSize.height * 0.26, 'center');

    // doc.setFont("Helvetica", "normal");
    doc.autoTable(columns, rows, {
      theme: 'grid',
      startY: doc.internal.pageSize.height * 0.32,
      showHeader: 'never',
      columnStyles: {
        "name": {
          fontSize: '14',
          fontStyle: 'bold',
          columnWidth: 'auto',
          cellPadding: 10
        },
        "content": {
          fontSize: '14',
          fontStyle: 'normal',
          columnWidth: 'auto',
          cellPadding: 10
        }
      },
    });

    var d = new Date();
    const day = new String(('0' + d.getDate()).slice(-2));
    const month = new String(('0' + (d.getMonth() + 1)).slice(-2));
    const year = new String(d.getFullYear());
    
    doc.setFontSize(16);
    doc.text(year + '. ' + month + '. ' + day + '. ', doc.internal.pageSize.width / 2, doc.internal.pageSize.height * 0.84, 'center');
    doc.text("Korean Society for Industrial and Applied Mathematics",  doc.internal.pageSize.width / 2, doc.internal.pageSize.height * 0.9, 'center');
    doc.addImage('data:image/png;base64,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',
      'PNG',  doc.internal.pageSize.width * 0.75, doc.internal.pageSize.height * 0.85, 90, 90);

    doc.save('reciept.pdf');

    $('#ticket-form').unbind('submit').submit();
  });

});
