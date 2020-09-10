import {
    DataProvider,
    Dimension,
    LayoutProvider,
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
    onCrossCategory: (category: string) => void;
    visible?: boolean;
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
        this.state = {
            dataProvider: this.props.dataProvider,
        };
        this.categories = [];
        this.onScroll = this.onScroll.bind(this);
    }

    private collectCategories() {
        for (let i = 0; i < this.props.dataProvider.getSize(); i++) {
            if (
                this.props.dataProvider.getDataForIndex(i).type === "category"
            ) {
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
        const currentCategory = this.categories.find((val, i, array) => {
            if (
                i === 0 &&
                rawEvent.nativeEvent.contentOffset.y < array[0].offset
            ) {
                return true;
            }
            if (
                i === array.length - 1 &&
                rawEvent.nativeEvent.contentOffset.y > val.offset
            ) {
                return true;
            }
            return (
                rawEvent.nativeEvent.contentOffset.y > val.offset &&
                rawEvent.nativeEvent.contentOffset.y < array[i + 1]?.offset
            );
        });
        this.props.onCrossCategory(
            currentCategory ? currentCategory.name : this.categories[0].name,
        );
    }

    private static transformData(
        data: ICategorizedData[],
        columns: number,
    ): any[] {
        let transformedData: any[] = [];
        data.forEach((value) => {
            transformedData.push({type: "category", name: value.category});
            value.items.forEach((item: object, index: number) => {
                transformedData.push({
                    type: index % columns,
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

    static buildProviders(
        layouts: LayoutProvider | Dimension[],
        data: DataProvider | ICategorizedData[],
    ) {
        let dataProvider: DataProvider;
        let layoutProvider: LayoutProvider;

        if (data instanceof DataProvider) {
            dataProvider = data;
        } else {
            dataProvider = new DataProvider((r1, r2) => {
                return r1.id !== r2.id;
            }).cloneWithRows(
                this.transformData(
                    data,
                    layouts instanceof LayoutProvider ? 1 : layouts.length - 1,
                ),
            );
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
                        dim.width =
                            layouts[
                                typeof type === "number" ? type + 1 : 0
                            ].width;
                        dim.height =
                            layouts[
                                typeof type === "number" ? type + 1 : 0
                            ].height;
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
        const {
            rowRenderer,
            layoutProvider,
            dataProvider,
            visible,
            children,
            ...otherProps
        } = this.props;

        return (
            <>
                {visible ? (
                    <RecyclerListView
                        layoutProvider={layoutProvider}
                        dataProvider={this.state.dataProvider}
                        ref={this.list}
                        rowRenderer={rowRenderer}
                        onScroll={this.onScroll}
                        {...otherProps}
                    />
                ) : null}
            </>
        );
    }
}
