const seFigure1 = document.querySelector("d-figure.nngt-single-epoch-1");
var se1;

seFigure1.addEventListener("ready", function() {
  console.log('nngt-single-epoch-1 ready');
  var epochs = [99,];
  var urls = utils.getTeaserDataURL();
  var [gl, programs] = utils.initGL(
    '#nngt-single-epoch-1', 
    [['shaders/teaser_vertex.glsl', 'shaders/teaser_fragment.glsl']]
  );
  var kwargs = { epochs, shouldAutoNextEpoch:false, };
  se1 = new TeaserRenderer(gl, programs[0], kwargs);
  allViews.push(se1);
  se1.overlay = new TeaserOverlay(se1);
  se1.overlay.epochIndicator.remove();
  se1 = utils.loadDataToRenderer(urls, se1);

  utils.addDatasetListener(function(){
    se1.pause();
    // se1.dataObj.dataTensor = null;
    // se1.dataObj.labels = null;

    var urls = utils.getTeaserDataURL(utils.getDataset());
    se1 = utils.loadDataToRenderer(urls, se1);
    se1.overlay.initLegend(
      utils.baseColors.slice(0,10), utils.getLabelNames());
    if(utils.getDataset() == 'cifar10'){
      se1.setColorFactor(0.0);
    }else{
      se1.setColorFactor(utils.COLOR_FACTOR);
    }
  });
  
  window.addEventListener('resize', ()=>{
    se1.overlay.resize();
    se1.setFullScreen(se1.isFullScreen);
  });
});

seFigure1.addEventListener("onscreen", function() {
  console.log('se1 onscreen');
  if(se1 && se1.play){
    se1.shouldRender = true;
    se1.play();
  }
  for(let view of allViews){
    if(view !== se1 && view.pause){
      view.pause();
    }
  }
});

seFigure1.addEventListener("offscreen", function() {
  console.log('se offscreen');
  if(se1 && se1.pause){
    se1.pause();
  }
});