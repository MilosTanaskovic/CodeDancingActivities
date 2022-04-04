import { observer } from 'mobx-react-lite'
import React, {useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Grid, Loader } from 'semantic-ui-react'
import { PagingParams } from '../../../app/models/pagination'
import { useStore } from '../../../app/stores/store'
import ActivityFilters from './ActivityFilters'
import ActivityList from './ActivityList'
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder'

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if(activityRegistry.size === 0) loadActivities();
    }, [activityRegistry.size, loadActivities]);

    // if (activityStore.loadingInitial && !loadingNext) return <LoadingComponents content='Loading activities...' />

    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll> 
                )}
                     
            </Grid.Column>
            <Grid.Column width='6'>
               <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
});
