
'use strict';
var ejs            = require('ejs');
var fs             = require('fs');
var lg             = require('./log.js');
var pathFn         = require('path');
var absolutePathReg = /^[a-zA-Z0-9]*?\:\/\//;

module.exports.getPath = function(inConfig){
  
  var config         = inConfig;
  var ampEjsTmplPath = "";
  var cssFilePath    = "";
  var template       = "";
  var templateDir    = "";
  var logoPath_template;
  var logoPath_for_amp;
  var logoPath_template_width;
  var logoPath_template_height;
  var placeholderImgPath = "";
  var template       = "";
  var cssTxt         = "";
  var avatarPath_template;
  
  lg.setConfig(config);
  
  //------------------------------------
  // import template file
  //------------------------------------
  var ejsTemplateRelativePath = "sample/" + pathFn.basename(config.generator_amp.defaultAssetsPath.ejs);
  if(config.generator_amp && config.generator_amp.templateFilePath){
    ejsTemplateRelativePath = config.generator_amp.templateFilePath;
  }
  ampEjsTmplPath  = pathFn.join(process.env.PWD || process.cwd() , config.generator_amp.templateDir , ejsTemplateRelativePath);
  templateDir     = pathFn.join(process.env.PWD || process.cwd() , config.generator_amp.templateDir);
  if(fs.existsSync(ampEjsTmplPath)){
    template        = ejs.compile(fs.readFileSync(ampEjsTmplPath, 'utf8'), {filename: templateDir});
  }else{
    lg.log("error", "Not found the template file. Please check the options." , ampEjsTmplPath);
    return null;
  }
  
  //------------------------------------
  // import CSS file
  //------------------------------------
  cssFilePath = pathFn.join(process.env.PWD || process.cwd() , config.generator_amp.templateDir, "sample/" + pathFn.basename(config.generator_amp.defaultAssetsPath.css) );
  if(config.generator_amp && config.generator_amp.cssFilePath){
    cssFilePath = pathFn.join(process.env.PWD || process.cwd() , config.generator_amp.templateDir,config.generator_amp.cssFilePath);
  }
  
  var cssTxt = "";
  if(fs.existsSync(cssFilePath)){
    cssTxt    = fs.readFileSync(cssFilePath, 'utf8');
    cssTxt    = cssTxt.replace(/\@charset\s\"(UTF\-8|utf\-8)\"\;/g,"").replace(/\!important/g,"").replace(/((?!\s|\;|\{).)*?zoom\:.*?;/g,"");
  }else{
    lg.log("error", "Not found the css file. Please check the options. " , cssFilePath);
    return null;
  }
  
  
  
  //------------------------------------
  // select placeholder image path
  //------------------------------------
  var placeholderImg_template;
  if( config.generator_amp.placeholderImg && config.generator_amp.placeholderImg.path ){
    if(absolutePathReg.test(config.generator_amp.placeholderImg.path)){
      placeholderImg_template = config.generator_amp.placeholderImg.path;
    }else{
      placeholderImg_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.generator_amp.placeholderImg.path);
    }
  }else{
    placeholderImg_template = pathFn.join(config.root + config.generator_amp.assetDistDir , "sample/" , pathFn.basename(config.generator_amp.defaultAssetsPath.placeholder) );
  }
  
  
  
  //------------------------------------
  // select avator image path
  //------------------------------------
  //authorDetail.avatar.path
  var avatarPath_template;
  if( config.authorDetail && config.authorDetail.avatar && config.authorDetail.avatar.path && config.authorDetail.avatar.width  && config.authorDetail.avatar.height ){
    if(absolutePathReg.test(config.authorDetail.avatar.path)){
      avatarPath_template = config.authorDetail.avatar.path;
    }else{
      avatarPath_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.authorDetail.avatar.path);
    }
  }
  
  
  
  //site logo image
  if(config.generator_amp.logo_topImage && config.generator_amp.logo_topImage.path){
    if(config.generator_amp.logo_topImage.width && config.generator_amp.logo_topImage.height){
      if(absolutePathReg.test(config.generator_amp.logo_topImage.path)){
          logoPath_template         = config.generator_amp.logo_topImage.path;
      }else{
        logoPath_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.generator_amp.logo_topImage.path);
      }
      logoPath_template_width   = config.generator_amp.logo_topImage.width;
      logoPath_template_height  = config.generator_amp.logo_topImage.height;
      
    }else{
        lg.log("error", "Please setting the generator_amp.logo_topImage.width and height option." , "_config.yml");
        return null;
    }
  }
  
  //schema.org logo image
  if(absolutePathReg.test(config.generator_amp.logo.path)){
    if(!logoPath_template){
      logoPath_template = config.generator_amp.logo.path;
      logoPath_template_width   = config.generator_amp.logo.width;
      logoPath_template_height  = config.generator_amp.logo.height;
    }
    logoPath_for_amp  = config.generator_amp.logo.path;
  }else{
    if(!logoPath_template){
      logoPath_template = pathFn.join(config.root + config.generator_amp.assetDistDir ,config.generator_amp.logo.path);
      logoPath_template_width   = config.generator_amp.logo.width;
      logoPath_template_height  = config.generator_amp.logo.height;
    }
    logoPath_for_amp  = config.url + pathFn.join(config.root, config.generator_amp.assetDistDir ,config.generator_amp.logo.path);
  }
  
  
  return {
    ampEjsTmplPath : ampEjsTmplPath,
    cssFilePath : cssFilePath,
    
    template : template,
    cssTxt : cssTxt,
    avatarPath_template : avatarPath_template,
    placeholder_template: placeholderImg_template,
    logoPath_template : logoPath_template,
    logoPath_for_amp : logoPath_for_amp,
    logoPath_template_width : logoPath_template_width,
    logoPath_template_height : logoPath_template_height
  };
};
