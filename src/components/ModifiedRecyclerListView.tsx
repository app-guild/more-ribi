import React, {Component} from "react";
import {DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps} from "recyclerlistview";


interface IModifiedRecyclerListViewProps extends RecyclerListViewProps {
  ref_: any
  //sets size of elements,
  //array size determines number of columns
  layoutSize: {width: number, height: number}[]
  data: any[];
}

interface IModifiedRecyclerListViewState{
  dataProvider: DataProvider;
}

class ModifiedRecyclerListView extends Component<
  Readonly<IModifiedRecyclerListViewProps>,
  Readonly<IModifiedRecyclerListViewState>
  > {

  private layoutProvider: LayoutProvider | undefined;
  private data: any[];
  private categoriesBorders: {category: string, offset: number}[];
  private prevCategoryIndex: number = 0;

  constructor(props: any) {
    super(props);
    this.data = this.transformData(props.data)

    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1.id !== r2.id;
      }).cloneWithRows(this.data),
    };

    this.layoutProvider = props.layoutProvider? undefined
      :new LayoutProvider(
      (index) => { return this.data[index].type },
      (type, dim) => {
        if (type == "category"){
          dim.width = props.layoutSize[0].width;
          dim.height = props.layoutSize[0].height;
        }
        else {
          dim.width = props.layoutSize[type + 1].width;
          dim.height = props.layoutSize[type + 1].height;
        }
      }
    );
    this.categoriesBorders = []
    this.onRecyclerListViewScroll = this.onRecyclerListViewScroll.bind(this);
  }

  transformData(data: {category: string, products: any[]}[]){
    let transformedData: any[] = [];
    data.forEach((value)=>{
      transformedData.push({type: "category", name: value.category});
      value.products.forEach((value, index)=>{
        transformedData.push({type: index%(this.props.layoutSize.length-1), ...value});
      })
    })
    return transformedData;
  }

  onRecyclerListViewScroll(e: any){
    if (this.categoriesBorders.length){
      if (e.nativeEvent.contentOffset.y>this.categoriesBorders[this.prevCategoryIndex+1].offset)
        this.props.data[0].onCross(this.categoriesBorders[(this.prevCategoryIndex++)+1].category)
      if (e.nativeEvent.contentOffset.y>0 && e.nativeEvent.contentOffset.y<this.categoriesBorders[this.prevCategoryIndex].offset)
        this.props.data[0].onCross(this.categoriesBorders[(this.prevCategoryIndex--)-1].category)
    }
    else {
      this.getCategoriesBorders();
    }
  }

  getCategoriesBorders(){
    for (let i = 0; i < this.data.length; i++){
      if(this.data[i].type == "category")
        this.categoriesBorders.push({
          category: this.data[i].name,
          offset: this.props.ref_.current?.getLayout(i)?.y==undefined? -1: this.props.ref_.current?.getLayout(i)?.y -1
        })
    }
  }

  render() {
    const {
      rowRenderer,
      ref_,
      layoutProvider,
      ...otherProps
    } = this.props;

    return (
      <RecyclerListView
        layoutProvider={!!layoutProvider?layoutProvider:this.layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={rowRenderer}
        ref={ref_}
        onScroll={this.onRecyclerListViewScroll}
        {...otherProps}
      />
    );
  }
}

export default ModifiedRecyclerListView;
