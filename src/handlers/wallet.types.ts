export type fromPrivateKeyHandlerInput = {
  privateKey: string;
  provider?: string;
};

export type createMnemonicPhraseHandlerInput = {
  locale?: string;
  length?: 12 | 15 | 18 | 21 | 24;
};

export type fromMnemonicHandlerInput = {
  mnemonic: string;
  provider?: string;
  path?: string;
  locale?: string;
};
