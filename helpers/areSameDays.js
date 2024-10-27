export default function areSameDays(dates) {
  //   console.log('dates:', dates);
  let result = true;

  if (dates.length < 2) {
    result = false;
    return result;
  }

  for (let i = 0; i < dates.length - 1; i++) {
    // console.log('Compare dates:', typeof dates[i], 'vs', typeof dates[i + 1]);

    if (
      !dates[i] ||
      !dates[i + 1] ||
      !dates[i] instanceof Date ||
      !dates[i + 1] instanceof Date
    ) {
      //   console.warn('One date has bad type or is falthy');
      result = false;
      break;
    } else {
      //   console.warn('Compared dates are dates objects');
      if (dates[i].getDate() !== dates[i + 1].getDate()) {
        // console.warn('Wrong day');
        result = false;
        break;
      } else if (dates[i].getMonth() !== dates[i + 1].getMonth()) {
        // console.warn('Wrong month');
        result = false;
        break;
      } else if (dates[i].getFullYear() !== dates[i + 1].getFullYear()) {
        // console.warn('Wrong year');
        result = false;
        break;
      }
    }
  }

  return result;
}
