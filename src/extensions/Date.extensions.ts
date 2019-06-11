

interface Date {
  addDays(days: number, useThis?: boolean): Date;
  isToday(): boolean;
  clone(): Date;
  isAnotherMonth(date: Date): boolean;
  isWeekend(): boolean;
  isSameDate(date: Date): boolean;
  getStringDate(): String;
  format(fmt: string): string;
}

Date.prototype.addDays = function (days: number): Date {
   if (!days) return this;
   let date = this;
   date.setDate(date.getDate() + days);

   return date;
};

Date.prototype.isToday = function (): boolean{
   let today = new Date();
   return this.isSameDate(today);
};

Date.prototype.clone = function (): Date{
   return new Date(+this);
};

Date.prototype.isAnotherMonth = function (date: Date): boolean {
   return date && this.getMonth() !== date.getMonth();
};

Date.prototype.isWeekend = function (): boolean  {
   return this.getDay() === 0 || this.getDay() === 6;
};

Date.prototype.isSameDate = function (date: Date): boolean  {
   return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
};

Date.prototype.getStringDate = function (): String {
    //Month names in Brazilian Portuguese
    // let monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    //Month names in English
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let today = new Date();
    if (this.getMonth() == today.getMonth() && this.getDay() == today.getDay()) {
        // return "Hoje";
        return "Today";
    } else if (this.getMonth() == today.getMonth() && this.getDay() == today.getDay() + 1) {
        // return "Amanhã";
        return "Tomorrow";
    } else if (this.getMonth() == today.getMonth() && this.getDay() == today.getDay() - 1) {
        // return "Ontem";
        return "Yesterday";
    } else {
        // return this.getDay() + ' de ' + monthNames[this.getMonth()] + ' de ' + this.getFullYear();
        return monthNames[this.getMonth()] + ' ' + this.getDay() + ', ' +  this.getFullYear();
    }
};

Date.prototype.format = function (fmt) {
  let o: any = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
    "H+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  let week: any = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
};