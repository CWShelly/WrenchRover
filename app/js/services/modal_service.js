module.exports = function(app) {
  app.factory('modalService', () => {


    console.log('modal service used');

    this.instance = 'instance';
    this.a = true;

    this.indexNumberA = 99;
    this.indexNumberB = 999;
    this.user_name = 'Sign in';

    console.log(this.indexNumberA);
    console.log(this.indexNumberB);


    console.log(this.status);
    return {
    //   indexNumberA: 5,
      message: '',

      indexNumberB: 7,
      thing: 1,
      dashTest: true,
      heading: 'BATMAAAAAAN',
      apptArr: [],
      dateArr: [],
      timesArr: [],
      instance: this.instance,
      d: new Date(),
      status: {
        isopen: false
      },
      closeDropDown: function() {
        console.log('closing from the ms');

        this.status.isopen = false;
        // console.log(this.status.isopen);
      },


      pass: function(x) {
        this.instance = x;
        // console.log(x);
        return this.instance;
      },

      addDate: function(x, month, today) {

        if (this.mo - 13 < today < this.mo && x <= 13) {

          this.the_month = month + 1;
        } else {
          this.the_month = month;
        }


        console.log(x);
        this.dateArr.push(x);
        console.log(this.dateArr);
        return this.dateArr;
      },

      getMonthEnd: function(value) {
        // console.log(value);
        return this.mo = value;

      },

      pickTimes: function(value) {

        this.timesArr.push(value);

        this.apptArr.push(this.the_month + '/' + this.date + ' at ' + value);
        console.log(this.apptArr);

        return this.apptArr;
      }


    };
  });

};
