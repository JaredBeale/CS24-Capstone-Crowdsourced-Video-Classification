import createClass from 'create-react-class';
import { SearchableSingleSelect } from 'lucid-ui';
import React from 'react';

const { Option } = SearchableSingleSelect;

export default createClass({
  render() {
    return (<SearchableSingleSelect
        SearchField={{ placeholder: 'Label' }}
        style={{ maxWidth: '500px' }}
        size="large"
        onSelect={this.props.onchange}
      >
      {this.props.labels.map(function(value){
        return (<Option key={`label-${value}`}>
                  {value}
                </Option>)

      })}
      </SearchableSingleSelect>
    );
  },
});
