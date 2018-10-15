@ECHO OFF
CLS

CMD /C grunt --gruntfile "gruntfile.js" cleanTask --color
CMD /C grunt --gruntfile "gruntfile.js" buildTask --color