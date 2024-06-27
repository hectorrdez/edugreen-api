export default class DateUtils {
  static toMySQLFormat(date: Date): string {
    return date.toISOString().slice(0, 19).replace("T", " ");
  }
  static obtainCurrentDate() {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formatedDay = day < 10 ? `0${day}` : day;
    const formatedMonth = month < 10 ? `0${month}` : month;
    const formatedHour = hour < 10 ? `0${hour}` : hour;
    const formatedMin = minutes < 10 ? `0${minutes}` : minutes;
    const formatedSec = seconds < 10 ? `0${seconds}` : seconds;

    const result = {
      day: formatedDay,
      month: formatedMonth,
      year: year,
      hour: formatedHour,
      min: formatedMin,
      sec: formatedSec,
    };

    return result;
  }
  public static obtainCurrentDateString() {
    const dateComp: any = DateUtils.obtainCurrentDate();
    return `${dateComp.year}/${dateComp.month}/${dateComp.day} ${dateComp.hour}:${dateComp.min}:${dateComp.sec}`;
  }
  public static secondsDifferenceFromDate(dateComp: any): number {
    const currentDate = new Date(
      dateComp.year,
      dateComp.month - 1,
      dateComp.day,
      dateComp.hour,
      dateComp.min,
      dateComp.sec
    );

    const now = new Date();

    const difference = (now.getTime() - currentDate.getTime()) / 1000;

    return difference;
  }
}
