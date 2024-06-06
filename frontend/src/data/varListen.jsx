var x = {
    aInternal: sessionStorage.getItem("loggedIn"),
    aListener: function(val) {},
    set a(val) {
      this.aInternal = val;
      this.aListener(val);
    },
    get a() {
      return this.aInternal;
    },
    registerListener: function(listener) {
      this.aListener = listener;
    }
  }
export {x}

// x.registerListener(function(val) {
//     alert("Someone changed the value of x.a to " + val);
//   });
// x.a=2
