import React, {Component} from "react";
import {DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";


class ModifiedRecyclerListView extends Component<Readonly<RecyclerListViewProps>, Readonly<any>> {

  private layoutProvider: LayoutProvider;

  constructor(props: any) {
    super(props);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1.id !== r2.id;
      }).cloneWithRows(props.data),
    };
    this.layoutProvider = new LayoutProvider(
      this.props.getLayoutTypeForIndex,
      (type, dim) => {
        const element = this.props.layoutForTypeDimensions.find((el)=>{
          return el.type == type
        })
        dim.height = element.height;
        dim.width = element.width;
      }
    );
  }

  render() {
    const {
      rowRenderer,
      ref_,
      layoutForTypeDimensions,
      getLayoutTypeForIndex,
      data,
      ...otherProps
    } = this.props;

    return (
      <RecyclerListView
        layoutProvider={this.layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={rowRenderer}
        ref={ref_}
        {...otherProps}
      />
    );
  }
}

export default ModifiedRecyclerListView;
