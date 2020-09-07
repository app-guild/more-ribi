import {
  DataProvider,
  LayoutProvider,
  Dimension,
  BaseLayoutProvider,
  RecyclerListView,
} from "recyclerlistview";
import React, {Component, createRef} from "react";
import {RecyclerListViewProps} from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import {ScrollEvent} from "recyclerlistview/src/core/scrollcomponent/BaseScrollView";

export interface ICategorizedData {
  category: string;
  items: object[];
}

interface ICategory {
  name: string;
  offset: number;
  index: number;
}

export interface ICategorizedRecyclerListViewProps
  extends RecyclerListViewProps {
  layoutSize: Dimension[];
  data: ICategorizedData[];
  onCrossCategory: (category: string) => void;
}

export interface ICategorizedRecyclerListViewState {
  dataProvider: DataProvider;
}

export class CategorizedRecyclerListView extends Component<
  Readonly<ICategorizedRecyclerListViewProps>,
  Readonly<ICategorizedRecyclerListViewState>
  > {
  private list = createRef<RecyclerListView<any, any>>();
  private layoutProvider: BaseLayoutProvider;
  private data: any[];
  private categories: ICategory[];
  private currentCategoryIndex: number = 0;

  constructor(props: ICategorizedRecyclerListViewProps) {
    super(props);
    this.data = this.transformData(props.data);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1.id !== r2.id;
      }).cloneWithRows(this.data),
    };
    this.layoutProvider = new LayoutProvider(
      (index) => {
        return this.data[index].type;
      },
      (type, dim) => {
        if (type === "category") {
          dim.width = props.layoutSize[0].width;
          dim.height = props.layoutSize[0].height;
        } else {
          dim.width = props.layoutSize[type + 1].width;
          dim.height = props.layoutSize[type + 1].height;
        }
      },
    );
    this.categories = [];
    this.onScroll = this.onScroll.bind(this);
  }

  private collectCategories() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].type === "category") {
        const offsetY = this.list.current?.getLayout(i)?.y;
        this.categories.push({
          name: this.data[i].name,
          offset: offsetY !== undefined ? offsetY - 1 : -1,
          index: i,
        });
      }
    }
  }

  private onScroll(rawEvent: ScrollEvent) {
    if (this.categories.length === 0) {
      this.collectCategories();
    }
    if (
      rawEvent.nativeEvent.contentOffset.y >
      this.categories[this.currentCategoryIndex + 1].offset
    ) {
      this.props.onCrossCategory(
        this.categories[this.currentCategoryIndex++ + 1].name,
      );
    }
    if (
      rawEvent.nativeEvent.contentOffset.y > 0 &&
      rawEvent.nativeEvent.contentOffset.y <
      this.categories[this.currentCategoryIndex].offset
    ) {
      this.props.onCrossCategory(
        this.categories[this.currentCategoryIndex-- - 1].name,
      );
    }
  }

  private transformData(data: ICategorizedData[]): any[] {
    let transformedData: any[] = [];
    data.forEach((value) => {
      transformedData.push({type: "category", name: value.category});
      value.items.forEach((item: object, index: number) => {
        transformedData.push({
          type: index % (this.props.layoutSize.length - 1),
          ...item,
        });
      });
    });
    return transformedData;
  }

  // Use number if you want to scroll to category by index
  public scrollToCategory(category: string | number) {
    let itemIndex = 0;
    if (typeof category === "string") {
      const found = this.categories.find((cat) => cat.name === category);
      if (!found) {
        return;
      }
      itemIndex = found.index;
    } else {
      itemIndex = this.categories[category].index;
    }
    this.list.current?.scrollToIndex(itemIndex, true);
  }

  // static buildLayoutProvider(layouts: LayoutProvider | Dimension[], data?: ICategorizedData[]){
  //   if(typeof layouts === typeof LayoutProvider)
  //     return layouts;
  //   else
  //     return new LayoutProvider(
  //       (index) => {
  //         return data[index].type;
  //       },
  //       (type, dim) => {
  //         if (type === "category") {
  //           dim.width = layouts[0].width;
  //           dim.height = layouts[0].height;
  //         } else {
  //           dim.width = layouts[type + 1].width;
  //           dim.height = layouts[type + 1].height;
  //         }
  //       },
  //     );
  // }

  render() {
    const {
      rowRenderer,
      layoutProvider,
      dataProvider,
      ...otherProps
    } = this.props;

    return (
      <RecyclerListView
        layoutProvider={
          layoutProvider ? layoutProvider : this.layoutProvider
        }
        dataProvider={
          dataProvider ? dataProvider : this.state.dataProvider
        }
        ref={this.list}
        rowRenderer={rowRenderer}
        onScroll={this.onScroll}
        {...otherProps}
      />
    );
  }
}
