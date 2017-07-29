import React from 'react';
import ReactPaginate from 'react-paginate';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';

class MessageDataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = { curPage: 0 };

    this.perPage = 40;
  }

  render() {
    const { messages } = this.props;
    const messageKeys = Object.keys(messages);
    return (
      <div>
        <List>
          {messageKeys
            .slice(
              this.state.curPage * this.perPage,
              this.state.curPage * this.perPage + this.perPage
            )
            .map(key =>
              <ListItem
                key={key}
                leftCheckbox={
                  <Checkbox
                    checked={messages[key].liked}
                    onTouchTap={() =>
                      this.props.onToggleMessage(key, !messages[key].liked)}
                  />
                }
                rightIconButton={
                  <IconButton
                    onTouchTap={() => this.props.onRemoveMessage(key)}
                    iconClassName="fa fa-trash-o"
                  />
                }
                primaryText={messages[key].message}
              />
            )}
        </List>

        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel="..."
          breakClassName={'break-me'}
          pageCount={Math.ceil(messageKeys.length / this.perPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={data => this.setState({ curPage: data.selected })}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

export default MessageDataset;
