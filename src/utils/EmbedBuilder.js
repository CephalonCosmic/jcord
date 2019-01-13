'use strict';
/*
  A handy dandy embed builder built by AlphaCoda, Stolen from discord.js because it is arguably the best!
*/
const Colors = {
  DEFAULT: 0x000000,
  WHITE: 0xFFFFFF,
  AQUA: 0x1ABC9C,
  GREEN: 0x2ECC71,
  BLUE: 0x3498DB,
  PURPLE: 0x9B59B6,
  LUMINOUS_VIVID_PINK: 0xE91E63,
  GOLD: 0xF1C40F,
  ORANGE: 0xE67E22,
  RED: 0xE74C3C,
  GREY: 0x95A5A6,
  NAVY: 0x34495E,
  DARK_AQUA: 0x11806A,
  DARK_GREEN: 0x1F8B4C,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368A,
  DARK_VIVID_PINK: 0xAD1457,
  DARK_GOLD: 0xC27C0E,
  DARK_ORANGE: 0xA84300,
  DARK_RED: 0x992D22,
  DARK_GREY: 0x979C9F,
  DARKER_GREY: 0x7F8C8D,
  LIGHT_GREY: 0xBCC0C0,
  DARK_NAVY: 0x2C3E50,
  BLURPLE: 0x7289DA,
  GREYPLE: 0x99AAB5,
  DARK_BUT_NOT_BLACK: 0x2C2F33,
  NOT_QUITE_BLACK: 0x23272A,
};
const isObject = d => typeof d === 'object' && d !== null;
const Flatten = (obj, ...props) => {
  if (!isObject(obj)) return obj;

  props = Object.assign(...Object.keys(obj).filter(k => !k.startsWith('_')).map(k => ({ [k]: true })), ...props);

  const out = {};

  for (let [prop, newProp] of Object.entries(props)) {
    if (!newProp) continue;
    newProp = newProp === true ? prop : newProp;

    const element = obj[prop];
    const elemIsObj = isObject(element);
    const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;

    // If it's a collection, make the array of keys
    if (element instanceof require('./Collection')) out[newProp] = Array.from(element.keys());
    // If it's an array, flatten each element
    else if (Array.isArray(element)) out[newProp] = element.map(e => Flatten(e));
    // If it's an object with a primitive `valueOf`, use that value
    else if (typeof valueOf !== 'object') out[newProp] = valueOf;
    // If it's a primitive
    else if (!elemIsObj) out[newProp] = element;
  }

  return out;
};
const ResolveColor = (color) => {
  if (typeof color === 'string') {
    if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
    if (color === 'DEFAULT') return 0;
    color = Colors[color] || parseInt(color.replace('#', ''), 16);
  } else if (color instanceof Array) {
    color = (color[0] << 16) + (color[1] << 8) + color[2];
  }

  if (color < 0 || color > 0xFFFFFF) throw new RangeError('COLOR_RANGE');
  else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');

  return color;
};
const ResolveString = (data) => {
  if (typeof data === 'string') return data;
  if (data instanceof Array) return data.join('\n');
  return String(data);
};
module.exports = class EmbedBuilder {
  constructor(data = {}) {
    this.prepare(data);
  }
  prepare(data) {
    this.type = data.type;
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
    this.color = data.color;
    this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;
    this.fields = data.fields ? data.fields.map(Object.assign(Object.create(this), this)) : [];

    this.thumbnail = data.thumbnail ? {
      url: data.thumbnail.url,
      proxyURL: data.thumbnail.proxy_url,
      height: data.thumbnail.height,
      width: data.thumbnail.width,
    } : null;

    this.image = data.image ? {
      url: data.image.url,
      proxyURL: data.image.proxy_url,
      height: data.image.height,
      width: data.image.width,
    } : null;

    this.video = data.video;
    this.author = data.author ? {
      name: data.author.name,
      url: data.author.url,
      iconURL: data.author.iconURL || data.author.icon_url,
      proxyIconURL: data.author.proxyIconUrl || data.author.proxy_icon_url,
    } : null;

    this.provider = data.provider;
    this.footer = data.footer ? {
      text: data.footer.text,
      iconURL: data.footer.iconURL || data.footer.icon_url,
      proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
    } : null;

    this.files = [];
    if (data.files) {
      this.files = data.files;
    }
  }

  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash
   * @type {?string}
   * @readonly
   */
  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  createField(name, value, inline) {
    this.fields.push(this.constructor.checkField(name, value, inline));
    return this;
  }

  createBlankField(inline) {
    return this.addField('\u200B', '\u200B', inline);
  }

  attachFiles(files) {
    this.files = this.files.concat(files);
    return this;
  }

  assignAuthor(name, iconURL, url) {
    this.author = { name: ResolveString(name), iconURL, url };
    return this;
  }

  assignColor(color) {
    this.color = ResolveColor(color);
    return this;
  }

  assignDescription(description) {
    description = ResolveString(description);
    this.description = description;
    return this;
  }

  assignFooter(text, iconURL) {
    text = ResolveString(text);
    this.footer = { text, iconURL };
    return this;
  }

  assignImage(url) {
    this.image = { url };
    return this;
  }

  assignThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  assignTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  assignTitle(title) {
    title = ResolveString(title);
    this.title = title;
    return this;
  }

  assignURL(url) {
    this.url = url;
    return this;
  }

  toJSON() {
    return Flatten(this, { hexColor: true });
  }

  _apiTransform() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author ? {
        name: this.author.name,
        url: this.author.url,
        icon_url: this.author.iconURL,
      } : null,
      footer: this.footer ? {
        text: this.footer.text,
        icon_url: this.footer.iconURL,
      } : null,
    };
  }

  static checkField(name, value, inline = false) {
    name = ResolveString(name);
    if (!name) throw new RangeError('EMBED_FIELD_NAME');
    value = ResolveString(value);
    if (!value) throw new RangeError('EMBED_FIELD_VALUE');
    return { name, value, inline };
  }
};