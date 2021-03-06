import moment from 'moment';
import GregorianCalendar from 'gregorian-calendar';

const localeMap = {
  en: 'en_US',
  'zh-cn': 'zh_CN',
};

export function momentToGregorianCalendar(time) {
  if (!time) return;

  const locale = time.locale();
  /* eslint-disable global-require, import/no-dynamic-require */
  const calendarLocale = require(`gregorian-calendar/lib/locale/${localeMap[locale]}`);
  /* eslint-enable global-require, import/no-dynamic-require */
  const convertedTime = new GregorianCalendar(calendarLocale);
  convertedTime.setTime(time.valueOf());
  return convertedTime; // eslint-disable-line consistent-return
}

export function momentToDate(time) {
  if (!time) return;
  return time.toDate(); // eslint-disable-line consistent-return
}

export function oldFormatToNewFormat(format) {
  return format.split('').map((c) => {
    if (c === 'y') {
      return 'Y';
    } else if (c === 'd') {
      return 'D';
    }
    return c;
  }).join('');
}

export function commonPickerPropsAdapter(props, defaultProps) {
  const adapted = { ...props };
  const format = oldFormatToNewFormat(adapted.format || defaultProps.format);
  if (adapted.format) {
    adapted.format = format;
  }
  if (adapted.disabledDate) {
    const usersDisabledDate = adapted.disabledDate;
    adapted.disabledDate = function (currentMoment) {
      const currentGregorian = momentToDate(currentMoment);
      return usersDisabledDate(currentGregorian);
    };
  }
  return adapted;
}

export function singlePickerPropsAdapter(props) {
  const adapted = { ...props };
  const format = props.format;
  if (adapted.value) {
    adapted.value = moment(adapted.value, format);
  }
  if (adapted.defaultValue) {
    adapted.defaultValue = moment(adapted.defaultValue, format);
  }
  if (adapted.onChange) {
    const usersOnChange = adapted.onChange;
    adapted.onChange = function (dateMoment, dateString) {
      const dateGregorian = momentToDate(dateMoment);
      return usersOnChange(dateGregorian, dateString);
    };
  }
  return adapted;
}
