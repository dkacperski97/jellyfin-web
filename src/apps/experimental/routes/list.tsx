import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { FC } from 'react';
import useCurrentTab from 'hooks/useCurrentTab';
import Page from 'components/Page';
import PageTabContent from '../components/library/PageTabContent';
import { LibraryTab } from 'types/libraryTab';
import { CollectionType } from 'types/collectionType';
import { LibraryTabContent, LibraryTabMapping } from 'types/libraryTabContent';
import { useSearchParams } from 'react-router-dom';

const albumsTabContent: LibraryTabContent = {
    viewType: LibraryTab.Photos,
    collectionType: CollectionType.Photos,
    isBtnPlayAllEnabled: true,
    isBtnShuffleEnabled: true
};

const photosTabMapping: LibraryTabMapping = {
    0: albumsTabContent
};

const List: FC = () => {
    const [ searchParams ] = useSearchParams();
    const currentTab = photosTabMapping[0];

    return (
        <Page
            id='listPage'
            className='libraryPage noSecondaryNavPage'
        >
            <PageTabContent
                key={`${currentTab.viewType} - ${searchParams.get('parentId')}`}
                currentTab={currentTab}
                parentId={searchParams.get('parentId')}
            />
        </Page>
    );
};

export default List;
