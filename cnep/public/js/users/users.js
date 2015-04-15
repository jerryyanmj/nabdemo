




  //Event handling
  $('#btnBottlenecks').click(function(){ dcView(); });
  $('#rdVisual').click(function(){
    if ($('#btnRoutes').is(':disabled')){
      showVisual('routeChart');
    }else{
      if($('#dcTable_wrapper').hasClass('hide')) drillView();
      else dcView();
    }
  });

