// ----------------------------------------------------------------------------
// Copyright (c) Ben Coleman, 2020
// Licensed under the MIT License.
//
// Set of methods to call the beta Microsoft Graph API, using REST and fetch
// Requires auth.js
// ----------------------------------------------------------------------------

import auth from './auth'

const GRAPH_BASE = 'https://graph.microsoft.com/beta'
const GRAPH_SCOPES = [
  'user.read',
  'files.read',
  'files.read.all',
  'files.readwrite',
  'files.readwrite.all',
  'sites.readwrite.all',
  'sites.read.all',
  'openid',
  'profile',
  'email',
]

let accessToken

const driveId = 'eb3548181cf4dc64'
const itemId = 'EB3548181CF4DC64!166'
const libraryId = 'EB3548181CF4DC64!173'

/* project and proposal in chert workspace */
const projectFolderId = 'EB3548181CF4DC64!167'
const proposalFolderId = 'EB3548181CF4DC64!174'

/* project and proposal in library */
const libraryProjectFolderId = 'EB3548181CF4DC64!191'
const libraryProposalFolderId = 'EB3548181CF4DC64!200'

const excelFileId = 'EB3548181CF4DC64!275'

export default {
  // Get details of user, and return as JSON
  // https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http#response-1
  //
  async getSelf() {
    let resp = await callGraph('/me')
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async getFiles() {
    let resp = await callGraph(`/me/drive/sharedWithMe`)
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async createProjectFolder(item) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${projectFolderId}/children`,
      item
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async createProposalFolder(item) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${proposalFolderId}/children`,
      item
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async createLibraryProjectFolder(item) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${libraryProjectFolderId}/children`,
      item
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async createProjectMediaFolder(item, onedriveId) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${onedriveId}/children`,
      item
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async copyRenumirationFileToProposal(item) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${excelFileId}/copy`,
      item
    );

    if(resp) {
      let data = await resp.json()
      return data
    }
  },

  async createLibraryProposalFolder(item) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${libraryProposalFolderId}/children`,
      item
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async uploadProposalFile({ fileName, fileContent, folder }) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${itemId}:/Proposals/${folder}/${fileName}:/createUploadSession`,
      {
        item: {
          "@microsoft.graph.conflictBehavior": "replace",
          name: fileName,
        },
        deferCommit: false
      }
    )
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async uploadProjectFile({ fileName, fileContent, folder }) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${itemId}:/Projects/${folder}/${fileName}:/createUploadSession`,
      {
        item: {
          "@microsoft.graph.conflictBehavior": "replace",
          name: fileName,
        },
        deferCommit: false
      }
    )
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async createProjectUploadSession({ fileName, fileContent, folder }) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${libraryId}:/Projects/${folder}/${fileName}:/createUploadSession`,
      {
        item: {
          '@microsoft.graph.conflictBehavior': 'replace',
          name: fileName,
        },
        deferCommit: false,
      }
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async createProposalUploadSession({ fileName, fileContent, folder }) {
    let resp = await postGraph(
      `/drives/${driveId}/items/${libraryId}:/Proposals/${folder}/${fileName}:/createUploadSession`,
      {
        item: {
          '@microsoft.graph.conflictBehavior': 'replace',
          name: fileName,
        },
        deferCommit: false,
      }
    )

    if (resp) {
      let data = await resp.json()
      return data
    }
  },


  async uploadFileInChunk({ fileName, fileContent, uploadUrl }) {
    let nextChunkRange = '0-10000000' // 60MB
    let startChunk = Number(nextChunkRange.split('-')[0])
    let endChunk = (startChunk + 10000000) > fileContent.size ? fileContent.size : startChunk + 10000000 // 60MB
    let tempEndChunk = endChunk;
    let data = null;
    do{
      const headers = {
        'Content-Range': `bytes ${startChunk}-${endChunk === fileContent.size - 1 ? fileContent.size : endChunk-1}/${fileContent.size}`,
      }
      const fileChunk = fileContent.slice(startChunk, endChunk)
      let resp = await customPutGraph(uploadUrl, fileChunk, headers)
      if (resp) {
        data = await resp.json()
        nextChunkRange = data.nextExpectedRanges && data.nextExpectedRanges[0]

        if(nextChunkRange) {
          startChunk = Number(nextChunkRange.split('-')[0])
          tempEndChunk = startChunk + 10000000 // 60MB - 1 byte
          endChunk = tempEndChunk > fileContent.size ? fileContent.size : tempEndChunk
        }else {
          return data;
        }
      }
    } while(endChunk <= fileContent.size)

    return data;
  },

  async createFile({ fileName, folder }) {
    let resp = await putGraph(
      `/drives/${driveId}/items/${itemId}:/Proposals/${folder}:/workbook/`,
      {
        name: fileName,
        file: {}
      }
    )
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async updateProjectName({ name, onedriveId }) {
    let resp = await patchGraph(`/drives/${driveId}/items/${onedriveId}`, {
      name,
    })
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async moveProjectToLibrary({ onedriveId, name }) {
    let resp = await patchGraph(`/drives/${driveId}/items/${onedriveId}`, {
      parentReference: { id: libraryProjectFolderId },
      name,
    })
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async moveProposalToLibrary({ onedriveId, name }) {
    let resp = await patchGraph(`/drives/${driveId}/items/${onedriveId}`, {
      parentReference: { id: libraryProposalFolderId },
      name,
    })
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  async deleteFolder({ onedriveId }) {
    let resp = await deleteGraph(`/drives/${driveId}/items/${onedriveId}`)
    if (resp) {
      return resp
    }
  },

  async deleteFile({ onedriveId }) {
    let resp = await deleteGraph(`/drives/${driveId}/items/${onedriveId}`);

    if(resp) {
      return resp
    }
  },

  //
  // Get user's photo and return as a blob object URL
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  //
  async getPhoto() {
    let resp = await callGraph('/me/photos/240x240/$value')
    if (resp) {
      let blob = await resp.blob()
      return URL.createObjectURL(blob)
    }
  },

  //
  // Search for users
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  //
  async searchUsers(searchString, max = 50) {
    let resp = await callGraph(
      `/users?$filter=startswith(displayName, '${searchString}') or startswith(userPrincipalName, '${searchString}')&$top=${max}`
    )
    if (resp) {
      let data = await resp.json()
      return data
    }
  },

  //
  // Accessor for access token, only included for demo purposes
  //
  getAccessToken() {
    return accessToken
  },
}

//
// Common fetch wrapper (private)
//
async function callGraph(apiPath) {
  // Acquire an access token to call APIs (like Graph)
  // Safe to call repeatedly as MSAL caches tokens locally
  accessToken = await auth.acquireToken(GRAPH_SCOPES)

  let resp = await fetch(`${GRAPH_BASE}${apiPath}`, {
    headers: { authorization: `bearer ${accessToken}` },
  })

  if (!resp.ok) {
    throw new Error(
      `Call to ${GRAPH_BASE}${apiPath} failed: ${resp.statusText}`
    )
  }

  return resp
}

async function postGraph(apiPath, data) {
  accessToken = await auth.acquireToken(GRAPH_SCOPES)

  let resp = await fetch(`${GRAPH_BASE}${apiPath}`, {
    method: 'POST',
    headers: {
      authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!resp.ok) {
    throw new Error(
      `Call to ${GRAPH_BASE}${apiPath} failed: ${resp.statusText}`
    )
  }

  return resp
}

async function putGraph(apiPath, data) {
  accessToken = await auth.acquireToken(GRAPH_SCOPES)

  let resp = await fetch(`${GRAPH_BASE}${apiPath}`, {
    method: 'PUT',
    headers: {
      authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: data,
  })

  if (!resp.ok) {
    throw new Error(
      `Call to ${GRAPH_BASE}${apiPath} failed: ${resp.statusText}`
    )
  }

  return resp
}

async function customPutGraph(apiPath, data, headers) {
  accessToken = await auth.acquireToken(GRAPH_SCOPES)

  let resp = await fetch(apiPath, {
    method: 'PUT',
    headers: {
      authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data,
  })

  if (!resp.ok) {
    throw new Error(`Call to ${apiPath} failed: ${resp.statusText}`)
  }
  return resp
}

async function patchGraph(apiPath, data) {
  accessToken = await auth.acquireToken(GRAPH_SCOPES)

  let resp = await fetch(`${GRAPH_BASE}${apiPath}`, {
    method: 'PATCH',
    headers: {
      authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!resp.ok) {
    throw new Error(
      `Call to ${GRAPH_BASE}${apiPath} failed: ${resp.statusText}`
    )
  }

  return resp
}

async function deleteGraph(apiPath) {
  accessToken = await auth.acquireToken(GRAPH_SCOPES)

  let resp = await fetch(`${GRAPH_BASE}${apiPath}`, {
    method: 'DELETE',
    headers: {
      authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!resp.ok) {
    throw new Error(
      `Call to ${GRAPH_BASE}${apiPath} failed: ${resp.statusText}`
    )
  }

  return resp
}
