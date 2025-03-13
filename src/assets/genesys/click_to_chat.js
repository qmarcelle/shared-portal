var calculatedCiciId = 'ABC123';

window._genesys.widgets.main.i18n.en.webchat={
  "ChatButton": "Chat with us",
    "ChatTitle": "Chat with us",
    "BotConnected": "",
  "BotDisconnected": "",
      "ChatFormSubmit": "START CHAT",
      "ConfirmCloseWindow": "<div class='modalTitle'>We'll be right here if we can</br>help with anything else.</div></br></br>Closing this window will end the session.",
      "ChatEndCancel": "STAY",
      "ChatEndConfirm": "CLOSE CHAT",
      "ConfirmCloseCancel": "STAY",
      "ActionsCobrowseStart": "Share Screen",
      "ConfirmCloseConfirm": "CLOSE CHAT",
      "ChatEndQuestion": "<div class='modalTitle'>We'll be right here if we can</br>help with anything else.</div></br></br>Closing this window will end our chat."
}

var firstNameInPascal= 'Lian'.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});

var lastNameInPascal= 'Sang'.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
			window._genesys.widgets.webchat = {
					dataURL: gmsServicesConfig.GMSChatURL(),
					enableCustomHeader: true,
					emojis: false,
					uploadsEnabled: false,
					maxMessageLength: 10000,
				    autoInvite: {
				    	enabled: false,
				        timeToInviteSeconds: 5,
				        inviteTimeoutSeconds: 30
				    },
			        chatButton: {
			            enabled: true,
			            openDelay: 100,
			            effectDuration: 100,
			            hideDuringInvite: true
				    },
				    userData:{
				    	firstname: 'Lian',
						lastname: 'Sang'
				    },
		            form:{
						inputs:[
							{
					            // custom: isAmplifyMem==='true'?"<tr class='activeChat'><td colspan='2' class='i18n' data-message='Questions or need advice? Let&#39;s talk.' style='font-size:30px'></td></tr>":"<tr class='activeChat'><td colspan='2' class='i18n' data-message='We&#39;re right here <br>for you. Let&#39;s chat.' style='font-size:30px'></td></tr>"
					        },
							{
					            custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>"
					        },
					        // <c:if test="${not routingchatbotEligible}"> 
					        {
					            custom:  calculatedCiciId == clientIdConst.SeniorCare ? "<tr class='activeChat'><td colspan='2'><br></td></tr>" : "<tr class='activeChat'><td colspan='2' class='cx-control-label i18n' data-message='What can we help you with today?'></td></tr>"
					        }, 
					        {
								id:'question_field',
								name:'SERV_TYPE',
								type:'select',
								options: setOptions(isDentalOnly() ? 'dentalOnly' : calculatedCiciId),
								validateWhileTyping: true,
							    validate: function (event, form, input, label, $, CXBus, Common){
						            if (input && input.val()) {
						            	$('button[data-message="ChatFormSubmit"]').removeAttr('disabled');
						            	$('button[data-message="ChatFormSubmit"]').attr({id : 'startChat', class : 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide'});
						                return true;
						            }else if(calculatedCiciId == clientIdConst.SeniorCare){
						            	return true;
						            }else{
						                return false;
						            }
							    }
							},
							// </c:if > 
							// <c:if test="${routingchatbotEligible}">  
							 {
									name:'SERV_TYPE',
									value:null,
									type:'hidden'
							 },
							 {
									name:'ChatBotID',
									value:'RoutingChatbot',
									type:'hidden'
							 },
							// </c:if > 
							 {
								    id:'LOB',
									name:'LOB',
									value:defaultedClientID(clientID()),
									type:'hidden'
							 },
							 {
								    id:'IsMedicalEligible',
									name:'IsMedicalEligible',
									value: true,
									type:'hidden'

							 },
							 {
								    id:'IsDentalEligible',
									name:'IsDentalEligible',
									value: true,
									type:'hidden'
							 },
							 {
								    id:'IsVisionEligible',
									name:'IsVisionEligible',
									value: true,
									type:'hidden'

							 },
							 {
								    id:'IDCardBotName',
									name:'IDCardBotName',
									value: '',
									type:'hidden'
							 },
							{
								custom: "<tr class='activeChat'><td>By clicking on the button, you agree with our <a href='#' onclick='OpenChatDisclaimer(); return false;'>Terms and Conditions</a> for chat.</td></tr>"
					        },
							{
					            custom: "<tr class='activeChat'><td colspan='2'><br></td></tr>"
					        },
							{
								id:'firstName_field',
								name:'firstname',
								label:'First Name',
								value: firstNameInPascal,
								type:'hidden'
							},
							{
								id:'lastname_field',
								name:'lastname',
								label:'Last Name',
								value: lastNameInPascal,
								type:'hidden'
							},
							{
								id:'memberId_field',
								name:'MEMBER_ID',
								label:'Member ID',
								value:'${subscriberID}'+'-'+'${sfx}',
								type:'hidden'
							},
							{
								id:'groupId_field',
								name:'GROUP_ID',
								label:'Group ID',
								value:'${groupID}',
								type:'hidden'
							},
							{
								id:'planId_field',
								name:'PLAN_ID',
								label:'Plan ID',
								value:'${memberMedicalPlanID}',
								type:'hidden'
								
							},
							{
								id:'dob_field',
								name:'MEMBER_DOB',
								label:'MEMBER DOB',
								value:'${memberDOB}',
								type:'hidden'
							},
							{
								id:'inquiryType_field',
								name:'INQ_TYPE',
								label:'Inquiry Type',
								value: chatType(calculatedCiciId),
								type:'hidden'
							}
							
							
						]
					}
				}


      initLocalWidgetConfiguration();

      window._genesys.widgets.onReady = function (CXBus) {
        // Use the CXBus object provided here to interface with the bus
        // CXBus here is analogous to window._genesys.widgets.bus
        localWidgetPlugin = CXBus.registerPlugin('LocalCustomization');
        
        localWidgetPlugin.subscribe("WebChat.opened", function (e) {
          // start of Date parsing for out-of-operational hours in real time
          let dt = new Date();
             let dtTimeStr = dt.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York',});
             dtTimeStr = dtTimeStr.split(':')[0] + '.' + dtTimeStr.split(':')[1];
             
             let currentHrMin = parseFloat(dtTimeStr);
             let endChatHours = rawChatHrs.substring(rawChatHrs.lastIndexOf('_')+1);
             let endChatHrMin = parseFloat(endChatHours);
             
             if (typeof endChatHrMin == 'number' && (0 < endChatHrMin && endChatHrMin < 12) && endChatHrMin != 24)
               endChatHrMin += 12;
           // end of Date parsing for out-of-operational hours in real time
           
          customizeAmplify();
            $("button[data-message='ChatFormCancel']").hide();
            if(routingchatbotEligible){
              $("button[data-message='ChatFormSubmit']").attr({id : 'startChat', class:'cx-btn cx-btn-default i18n cx-btn-primary buttonWide'});
            } else {
              $("button[data-message='ChatFormSubmit']").attr({disabled:   'disabled', id : 'startChat', class:'cx-btn cx-btn-default cx-disabled i18n cx-btn-primary buttonWide'});
              $("#question_field").attr('class', 'cx-input cx-form-control dropdownInput i18n');
          }
             
             $("button[data-message='ConfirmCloseCancel']").attr('class', 'cx-close-cancel cx-btn cx-btn-default i18n btn-secondary');
             $("button[data-message='ChatEndCancel']").attr('class', 'cx-end-cancel cx-btn cx-btn-default i18n btn-secondary');
             $("button[data-message='ChatEndConfirm']").click(closeChatWindow);
             $("textarea[data-message='ChatInputPlaceholder']").css('background', 'none');
             
            // start of Condition when member log in during active hours but open chat after working hours
             if(isChatAvailable === "true" && currentHrMin > endChatHrMin) {
               let tempUnavailableChatForm = {
                   inputs:[
                     {
                       custom: "<tr><td colspan='2' class='i18n' style='font-family: universStd;'>You&#39;ve reached us after business hours,<br>but we&#39;ll be ready to chat again soon.</td></tr>"
                   },
                   {
                       custom: "<tr><td id='reachUs' colspan='2' class='i18n' style='font-family: universStd;'>Reach us " + workingHrs +"</td></tr>"
                   }
               ]
             }
                            
              //  <c:if test="${groupType eq 'REGL' || groupType eq 'INDV' || isMedicalAdvantageGroup == true || groupID eq '116884'}">
            addAfterHoursLinks(tempUnavailableChatForm);
          // </c:if>
          
          $('.activeChat').hide();
                  
          tempUnavailableChatForm.inputs.forEach(function(element) {
            if (element.custom)
              $('.cx-form > .cx-form-inputs > table').append(element.custom);
          });
          
          $('.cx-button-group.cx-buttons-binary > button[data-message="ChatFormSubmit"]').hide()
             }
            // end of Condition when member log in during active hours but open chat after working hours
            
             if(calculatedCiciId == clientIdConst.SeniorCare){
           $("#question_field").hide();
           $('button[data-message="ChatFormSubmit"]').removeAttr('disabled');
           $('button[data-message="ChatFormSubmit"]').attr({id : 'startChat', class : 'cx-btn cx-btn-default i18n cx-btn-primary buttonWide'});
         }
             
             if(isChatAvailable === "false") {
           $('.cx-button-group.cx-buttons-binary').hide();
         }
             
        });
        
        localWidgetPlugin.subscribe("WebChat.messageAdded", function (e) {
              $('.cx-avatar.bot').find('svg').replaceWith(chatBotAvatar);
              webAlert.muted = false;
              
              //code to play audio notification on message from Agent
              if(e.data.message.type=='Agent'){
                 webAlert.play();
              }
          });
        
        localWidgetPlugin.subscribe("WebChat.errors", function (e) {
          OpenChatConnectionError();
        });
        
        localWidgetPlugin.subscribe("WebChat.submitted", function (e)
        {
          console.log("[GA4] - Chat Interaction - Start Chat");
          // GA - start chat interactions
          window.elementTag($(this).text(), "Chat", {action: "click", selection_type: "widget" }, "select_content", null);
          applyMessageScaler();
          customizeAmplify();
        });
  
        localWidgetPlugin.subscribe('CallUs.opened', function(e){
          $( ".cx-phone-number" ).after("<div class='cx-phone-subtitle'><span>Once you&rsquo;re on the line with us, say you want to &ldquo;share you screen.&rdquo;</span></div>");
          $( ".cx-call-us .cx-availability .cx-hours" ).prepend( "<span><b>Hours of operation</b></span>" );
          $( ".cx-call-us .cx-availability" ).after("<div class='cx-shareScreen-link'><span class='cx-cobrowse-offer' style='display: inline;'>Already on a call? <br><a role='link' href='javascript:startCoBrowseCall()' tabindex='0' class='cx-cobrowse-link'>Share your screen with us</a></span></div>");	
        });
    };

    var closeChatWindow = function () {
      if (localWidgetPlugin) {
        console.log("[GA4] - Chat Interaction - End Chat");
        // GA - end chat interactions
        window.elementTag($(this).text(), "Chat", {action: "click", selection_type: "widget" }, "select_content", null);
        localWidgetPlugin.command('WebChat.close').done(function(e) {
          customizeAmplify();
          // WebChat closed successfully
          }).fail(function(e){
          // WebChat is already closed or no active chat session
          });	
      }
    };
  
var setChatDisclaimerMesg = function(calculatedCiciId){	
  
  var disclaimerMesg = '';
  switch (calculatedCiciId) {
    case clientIdConst.BlueCare:
    case clientIdConst.BlueCarePlus:
      disclaimerMesg = 'For quality assurance your chat may be monitored and/or recorded. Benefits are based on the member&#39 eligibility when services are rendered. Benefits are determined by the Division of TennCare and are subject to change.';
      break;
    case clientIdConst.CoverTN:
      disclaimerMesg = 'This information provided today is based on current eligibility and contract limitations. Final determination will be made upon the completion of the processing of your claim.';
        break;
    default:
    disclaimerMesg ='This information provided today is based on current eligibility and contract limitations.<br>Final determination will be made upon the completion of the processing of your claim.<br>For quality assurance your chat may be monitored and/or recorded.<br><br>Estimates are not a confirmation of coverage or benefits. The Health Care Cost Estimator tool is designed to help you plan for health care costs. Your actual cost may be different based on your health status and services provided. Final determination will be made when the claims are received based on eligibility at time of service. Payment of benefits remains subject to any contract terms, exclusions, and/or riders. <br> <br> To better serve you, we may send you a survey or questions about your chat experience by email. Communications via unencrypted email over the internet are not secure, and there is a possibility that information included in an email can be intercepted and read by other parties besides the person to whom it is addressed.';
   }
  return disclaimerMesg;
};     

var OpenChatDisclaimer = function () {
    if (localWidgetPlugin) {
      var disclaimerMesg = setChatDisclaimerMesg(calculatedCiciId);
    localWidgetPlugin.command('WebChat.showOverlay', 
      { html: $("<div id='disclaimerId'><p class='termsNConditions'><span class='modalTitle'>Terms and Conditions</span> <br><br> " +disclaimerMesg+ " </p> </div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatDisclaimer();'>CLOSE</button></div>"), hideFooter: true}).done(function (e) {
               // WebChat opened successfully
               $("button[data-message='ChatFormSubmit']").hide();
             }).fail(function (e) {
               // WebChat isn't opened
           });
       }
   };

var CloseChatDisclaimer = function () {
  if (localWidgetPlugin) {
    localWidgetPlugin.command('WebChat.hideOverlay').done(function (e) {
      // WebChat opened successfully
      $("button[data-message='ChatFormSubmit']").show();
          }).fail(function (e) {
                   // WebChat isn't opened
               });
           }
     };

var OpenChatConnectionErrorOverlay = function () {
    if (localWidgetPlugin) {
    localWidgetPlugin.command('WebChat.showOverlay', 
      { html: $("<div><p class='termsNConditions'><span class='modalTitle'>Error Connecting to Chat Server</span><br><br>We're sorry for the inconvenience, please logout and log back in.</p></div><div style='padding-bottom:10px; background-color:#fff;'><button type='button' class='cx-btn cx-btn-primary buttonWide' onclick='CloseChatErrorOverlay();'>CLOSE</button></div>"), hideFooter: false}).done(function (e) {
               // WebChat opened successfully
             }).fail(function (e) {
               // WebChat isn't opened
           });
       }
   };
  
var CloseChatConnectionErrorOverlay = function () {
  if (localWidgetPlugin) {
    localWidgetPlugin.command('WebChat.hideOverlay').done(function (e) {
                   // WebChat opened successfully
               }).fail(function (e) {
                   // WebChat isn't opened
               });
           }
     };	
     
  var openCallUsWidget = function(){
  $('.gcb-smoke-base').hide();
  if (localWidgetPlugin) {
      localWidgetPlugin.command('CallUs.open').done(function (e) {
          }).fail(function (e) {
          console.error("Error opening call us widget");
          });
      }
    }

 var openWebChatWidget= function(){
   $('#cobrowse-contactUsScreen1').modal('hide');
    if (localWidgetPlugin) {
      localWidgetPlugin.command('WebChat.open').done(function (e) {
        customizeAmplify();
            // WebChat opened successfully
        }).fail(function (e) {
          console.error("Error opening WebChat  widget")
        });;
    }
   }	   