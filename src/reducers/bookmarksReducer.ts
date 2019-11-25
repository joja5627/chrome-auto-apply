import { pull } from "lodash";
import { produce } from "immer";
import { getType } from "typesafe-actions";
import { moveArrayElement } from "./../utils/moveArrayElement";
import { compareIndexes } from "./../utils/compareIndexes";
import { actions } from "../actions";
import { ReduxAction } from "../types/ReduxAction";
import { ChromeBookmark } from "../types/ChromeBookmark";

export type State = {
  readonly foldersById: { [id: string]: ChromeBookmark };
  readonly bookmarksById: { [id: string]: ChromeBookmark };
  readonly hiddenFolderIds: string[];
};

export const initialState: State = {
  foldersById: {},
  bookmarksById: {},
  hiddenFolderIds: []
};

export const bookmarksReducer = (
  state: State = initialState,
  action: ReduxAction
): State => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(actions.retrieveBookmarksSuccess): {
        draft.foldersById = action.payload.foldersById;
        draft.bookmarksById = action.payload.bookmarksById;
        break;
      }
      case getType(actions.hideFolder): {
        const folderId = action.payload;
        if (draft.hiddenFolderIds.indexOf(folderId) === -1) {
          draft.hiddenFolderIds.push(folderId);
        }
        break;
      }
      case getType(actions.showFolder): {
        const folderId = action.payload;
        if (draft.hiddenFolderIds.indexOf(folderId) > -1) {
          pull(draft.hiddenFolderIds, folderId);
        }
        break;
      }
      case getType(actions.moveBookmark): {
        // This action is triggered when the user moves a bookmark to a new
        // position. Since the reducer structure keeps the bookmarks in an
        // unordered structure (an object) we need to do some tricks to update
        // its position in the state.
        const { bookmark, oldIndex, newIndex } = action.payload;
        // First, we put all the folder's bookmarks in an array and we sort it
        // to get their current position (pre-sort)...
        let bookmarks = Object.values(state.bookmarksById)
          .filter(x => x.parentId === bookmark.parentId)
          .sort(compareIndexes);
        // Then, given the updated bookmark position, we move it in the array...
        bookmarks = moveArrayElement(bookmarks, oldIndex, newIndex);
        // And lastly we update the state by updating the index of all the
        // elements in the folder
        bookmarks.forEach((x, index) => {
          draft.bookmarksById[x.id].index = index;
        });
        break;
      }
      case getType(actions.rehydrateSuccess): {
        const persistedState = action.payload;
        if (persistedState.bookmarks) {
          return {
            ...initialState,
            ...persistedState.bookmarks
          };
        }
        break;
      }
      default:
        return state;
    }
  });
};
