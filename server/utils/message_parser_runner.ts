/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IMessage } from '../../common/types/chat_saved_object_attributes';
import { Interaction, MessageParser } from '../types';

export class MessageParserRunner {
  constructor(private readonly messageParsers: MessageParser[]) {}
  async run(interaction: Interaction): Promise<IMessage[]> {
    const sortedParsers = [...this.messageParsers];
    sortedParsers.sort((parserA, parserB) => {
      const { order: orderA = 999 } = parserA;
      const { order: orderB = 999 } = parserB;
      return orderA - orderB;
    });
    let results: IMessage[] = [];
    for (const messageParser of sortedParsers) {
      let tempResult: IMessage[] = [];
      try {
        tempResult = await messageParser.parserProvider(interaction);
      } catch (e) {
        tempResult = [];
      }
      results = [...results, ...tempResult];
    }
    return results;
  }
}
