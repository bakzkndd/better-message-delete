import React, { Component } from 'react';

import { TextArea } from '@vizality/components/settings';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';

export default class Settings extends Component {
  constructor (props) {
    super(props);
    this.Flex = getModuleByDisplayName('Flex');
    this.classes = {
      flexClassName: `${this.Flex.Direction.HORIZONTAL} ${this.Flex.Justify.START} ${this.Flex.Align.STRETCH} ${this.Flex.Wrap.NO_WRAP}`,
      alignCenter: getModule('alignCenter')
    };
  }

  render () {
    const { getSetting, updateSetting, toggleSetting } = this.props;
    const { classes } = this;

    return (
      <>
        <TextArea
          autofocus={false}
          autosize={false}
          disabled={false}
          flex={false}
          maxLength={256}
          name={''}
          onChange={val => {
            updateSetting('deleted-message-message', val);
            val -= getSetting('deleted-message-message').length;
          }}
          placeholder={'This message has been deleted'}
          resizeable={false}
          rows={3}
          value={getSetting('deleted-message-message')}
        >
          Deleted-Message Message
        </TextArea>
      </>
    );
  }

  get (setting) {
	const { getSetting } = this.props;
	return getSetting(setting)
  }
}