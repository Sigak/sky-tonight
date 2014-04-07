function getXYZ(t) {
        var step = 2*Math.PI/this.period;
		var x = this.r * Math.cos(t*step) ^ 0;
        var y = this.r * Math.sin(t*step) ^ 0;
        var z = y * Math.sin(this.angle) ^ 0;
        return {'x':x, 'y':y, 'z':z};
      }
      
      function getPlanetXYZ(t) {
        var earth = {
          r: 149,						/* должен зависеть от разности радиусов траекторий планет */
          period: 365.25,
          angle: 0,
          pericenter: 147,				/* зависит от радиуса */
          getXYZ: getXYZ,
        }
          earth.coordinates = earth.getXYZ(t + this.apseRotation * earth.period / (2*Math.PI));
      	  this.coordinates = earth.getXYZ.call(this, t + this.apseRotation * this.period / (2*Math.PI));
          var x = earth.coordinates.x - (earth.r - earth.pericenter);
          var y = earth.coordinates.y;
          x = this.coordinates.x - (this.r - this.pericenter) * Math.cos(this.apseRotation) - x ^ 0;
          y = this.coordinates.y - (this.r - this.pericenter) * Math.sin(this.apseRotation) - y ^ 0;
          var z = y * Math.sin(this.angle) ^ 0;
          return {'x':x, 'y':y, 'z':z};
       }
      
      function movePlanet() { 
        var time = timeNow - this.zeroTime;
        var x = this.coordinates.x;
        var y = this.coordinates.z;
        this.coordinates = this.getXYZ(time);
        sky.r = Math.sqrt(this.coordinates.x*this.coordinates.x+this.coordinates.z*this.coordinates.z); 
        sky.coordinates = sky.getXYZ(time+0.5);
        x = sky.coordinates.x + this.coordinates.x - x;
        y = sky.coordinates.y + this.coordinates.z - y;
        this.div.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      }

      function Planet(className, period, angle, zeroTime, pericenter, apseRotation) {
        this.zeroTime = Date.parse(zeroTime) / 86400000 ^ 0;
        var time = timeNow - this.zeroTime;
        this.r = 633;
        this.period = period;
        this.angle = angle;
        this.pericenter = pericenter;
        this.apseRotation = apseRotation;
        this.div = document.createElement('div');
        this.div.className = className;
        this.getXYZ = (className == 'moon') ? getXYZ : getPlanetXYZ;
        this.coordinates = this.getXYZ(time);
        this.animate = /*(this.coordinates.z >= 0) ? */movePlanet /*: function() {}*/;
        /*if (this.coordinates.z >= 0) {*/
          document.getElementById("outer").appendChild(this.div);
          sky.r = Math.sqrt(this.coordinates.x*this.coordinates.x+this.coordinates.z*this.coordinates.z); 
          this.div.style.transform = 'translateX(' + sky.getXYZ(time+0.5).x + 'px)';
        /*}*/
	  }
       
      var sky = {
        period: 1,
        angle: 0,
        getXYZ: getXYZ,
      }
      var timeNow = (new Date() / 86400000 ^ 0); /* (2014, 11, 1) */
      var saturn = new Planet('saturn', 10759, 0.445, '2008-00-26', 1353, 0.232);
      var upiter = new Planet('upiter', 4332.6, 0.419, '2010-09-21', 740.6, 1.524);
      var mars = new Planet('mars', 687, 0.434, '2003-08-27', 206, 2.215);
      var moon = new Planet('moon', 29.5, 0.489, '2008-08-02');
	  var timer = setInterval(function() {
        timeNow += 1/32; 
        moon.animate(); 
        mars.animate(); 
        upiter.animate(); 
        saturn.animate();
        if (timeNow % 1 == 0.5) clearInterval(timer);
      }, 100);