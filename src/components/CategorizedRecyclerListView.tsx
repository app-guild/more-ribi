import {DataProvider, Dimension, LayoutProvider, RecyclerListView} from "recyclerlistview";
import React, {Component, createRef} from "react";
import {RecyclerListViewProps} from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import {ScrollEvent} from "recyclerlistview/src/core/scrollcomponent/BaseScrollView";
import {ProductType} from "../entities/ProductType";
import Product from "../entities/Product";

export type ICategorizedData = Map<ProductType, Product[]>;

interface ICategory {
    name: string;
    offset: number;
    index: number;
}

export interface ICategorizedRecyclerListViewProps extends RecyclerListViewProps {
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
    private categories: ICategory[];
    private currentCategoryIndex: number = 0;

    constructor(props: ICategorizedRecyclerListViewProps) {
        super(props);
        this.categories = [];
        this.onScroll = this.onScroll.bind(this);
    }

    private collectCategories() {
        for (let i = 0; i < this.props.dataProvider.getSize(); i++) {
            if (this.props.dataProvider.getDataForIndex(i).type === "category") {
                if (i !== this.props.dataProvider.getSize() - 1) {
                    const offsetY = this.list.current?.getLayout(i + 1)?.y;
                    this.categories.push({
                        name: this.props.dataProvider.getDataForIndex(i).name,
                        offset: offsetY !== undefined ? offsetY - 1 : -1,
                        index: i,
                    });
                }
            }
        }
    }

    private onScroll(rawEvent: ScrollEvent) {
        if (this.categories.length === 0) {
            this.collectCategories();
        }
        if (
            this.categories[this.currentCategoryIndex + 1] &&
            rawEvent.nativeEvent.contentOffset.y > this.categories[this.currentCategoryIndex + 1].offset
        ) {
            this.props.onCrossCategory(this.categories[this.currentCategoryIndex++ + 1].name);
        }
        if (
            this.currentCategoryIndex > 0 &&
            rawEvent.nativeEvent.contentOffset.y < this.categories[this.currentCategoryIndex].offset
        ) {
            this.props.onCrossCategory(this.categories[this.currentCategoryIndex-- - 1].name);
        }
    }

    private static transformData(data: ICategorizedData, columns: number): any[] {
        let transformedData: any[] = [];

        for (const [type, products] of data.entries()) {
            transformedData.push({type: "category", name: type});
            products.forEach((item: object, index: number) => {
                transformedData.push({
                    type: index % columns,
                    item,
                });
            });
        }

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

    static buildProviders(layouts: LayoutProvider | Dimension[], data: DataProvider | ICategorizedData) {
        let dataProvider: DataProvider;
        let layoutProvider: LayoutProvider;

        if (data instanceof DataProvider) {
            dataProvider = data;
        } else {
            dataProvider = new DataProvider((r1, r2) => {
                return r1.id !== r2.id;
            }).cloneWithRows(this.transformData(data, layouts instanceof LayoutProvider ? 1 : layouts.length - 1));
        }

        if (layouts instanceof LayoutProvider) {
            layoutProvider = layouts;
        } else {
            layoutProvider = new LayoutProvider(
                (index) => {
                    return dataProvider.getDataForIndex(index).type;
                },
                (type, dim) => {
                    if (type === "category") {
                        dim.width = layouts[0].width;
                        dim.height = layouts[0].height;
                    } else {
                        dim.width = layouts[typeof type === "number" ? type + 1 : 0].width;
                        dim.height = layouts[typeof type === "number" ? type + 1 : 0].height;
                    }
                },
            );
        }

        return {
            dataProvider: dataProvider,
            layoutProvider: layoutProvider,
        };
    }

    render() {
        let resultRender = null;

        if (this.props.dataProvider.getSize()) {
            resultRender = (
                <RecyclerListView
                    {...this.props}
                    ref={this.list}
                    onScroll={this.onScroll}
                />
            );
        }

        return resultRender;
    }
}
