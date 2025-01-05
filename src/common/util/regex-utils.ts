export class RegexUtils {
  static readonly NO_SPECIAL_CHARACTERS = /^[^<>{}"'`;]*$/;

  static readonly NO_SPECIAL_CHARACTERS_SINGLE_LINE = /^[^<>{}"'`;\n\r]*$/;

  static readonly UID = /^[a-zA-Z0-9]+$/;

  static readonly URL = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/;
}
