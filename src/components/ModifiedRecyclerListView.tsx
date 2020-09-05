import React, {Component} from "react";
import {RecyclerListView, RecyclerListViewProps} from "recyclerlistview";


class ModifiedRecyclerListView extends Component<Readonly<RecyclerListViewProps>, Readonly<any>> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataProvider: props.dataProvider,
    };
  }

  render() {
    const {
      layoutProvider,
      rowRenderer,
      ref_,
      //onScroll,
      ...otherProps
    } = this.props
    return (
      <RecyclerListView
        layoutProvider={layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={rowRenderer}
        ref={ref_}
        //onScroll={onScroll}
        {...otherProps}
      />
    );
  }
}

export default ModifiedRecyclerListView;
