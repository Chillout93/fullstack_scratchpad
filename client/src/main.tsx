
import React, { useEffect, useRef, useState } from "react";
import * as _ from "lodash"
import { orderBy } from "lodash";
import { db, RequestCache, processQueue } from "./db";
import { useLiveQuery } from 'dexie-react-hooks'
import { useQuery } from "./use_query";
import { axiosMutate, AxiosResponse, AxiosSuccess } from "./axios";
import { postPostGroups } from "./models/post_groups";
import { postUserPostGroups } from "./models/user_post_groups";
import { deletePost, patchPost, postPost } from "./models/posts";
import { GetUsersWithPostGroups } from "../../shared/models/user";
import { Post } from "../../shared/models/post";

export const Main = () => {
  const [page, setPage] = useState('MAIN')
  const [isOnline, setIsOnline] = useState(true)

  window.addEventListener('online', () => setIsOnline(true))
  window.addEventListener('offline', () => setIsOnline(false))

  const PAGES = {
    'MAIN': <Page1 isOnline={isOnline} />,
    'TEST': <div>Hello world!</div>
  }

  return <div>
    <div className="flex gap-2">
      <button onClick={() => setPage('MAIN')}>Page 1</button>
      <button onClick={() => setPage('TEST')}>Page 2</button>
    </div>
    {PAGES[page]}
  </div>
}

export const Page1 = ({ isOnline }: { isOnline: boolean }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('629a2035-6822-4032-8f92-38127dd07bef')
  const [currentGroupId, setCurretGroupId] = useState<string>('5b85a2a8-8706-4d4b-8b03-4a57ff343f73')
  const [currentInput, setCurrentInput] = useState<string>('')
  const [editingRow, setEditingRow] = useState<typeof postsWithUsers[0]>()
  
  const [activeQueries, setActiveQueries] = useState<Record<string, () => Promise<void>>>()
  const activeQueriesRef = useRef(activeQueries); // Ref to store the latest activeQueries
  useEffect(() => {
    activeQueriesRef.current = activeQueries;
  }, [activeQueries]);

  const requests = orderBy(useLiveQuery(() => db.request_cache.toArray()), x => x.timestamp)

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const main = async () => {
      if (isOnline) {
        await processQueue(activeQueries!);
      }
    };

    if (isOnline) {
      main(); // Run immediately when online
      interval = setInterval(main, 5000); // Run every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount or when `isOnline` changes
    };
  }, [isOnline, activeQueries]);

  
  const usersQuery = useQuery<GetUsersWithPostGroups>(
    'users',
    setActiveQueries
  )

  const postsQuery = useQuery<Post[]>(
    'posts',
    setActiveQueries
  )

  if (usersQuery.loading || postsQuery.loading) return
  if (usersQuery.error && isOnline) return JSON.stringify(usersQuery.error)
  if (postsQuery.error && isOnline) return JSON.stringify(postsQuery.error)

  const { data: users, setData: setUsers } = usersQuery
  const { data: posts, setData: setPosts } = postsQuery

  const selectedUser = users?.find(x => x.id === currentUserId)
  const groups = selectedUser?.user_post_groups.map(x => x.post_groups)

  const postsWithUsers = orderBy(posts!
    .filter(x => x.group_id === currentGroupId)
    .map(x => ({
      id: x.id,
      text: x.content,
      name: users?.find(y => y.id === x.user_id)?.name,
      created_at: x.created_at,
    })), x => new Date(x.created_at))


  const handleAddGroup = async () => {
    const newGroup = { id: crypto.randomUUID(), name: `group-${crypto.randomUUID().substring(0, 4)}` }
    const newUserPostGroup = { id: crypto.randomUUID(), post_group_id: newGroup.id, user_id: currentUserId }

    const response = await postPostGroups(newGroup)
    const response1 = await postUserPostGroups(newUserPostGroup)

    if (response.status === 'ERROR') alert(JSON.stringify(response.message))

    setUsers(prev => prev.map(x => x.id === currentUserId 
      ? { ...x, user_post_groups: [...x.user_post_groups, { ...newUserPostGroup, post_groups: newGroup }]} 
      : x))
  }
  
  return <div className="flex gap-4">

  <div className="flex flex-col gap-4">
    <div>Users</div>
    <select value={currentUserId} onChange={(e) => setCurrentUserId(e.currentTarget.value)}>
      <option key={undefined} value={undefined}>-- Please Select --</option>
      {users?.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
    </select>
  </div>
  <div className="flex flex-col gap-4">
    <div>Groups</div>
    <button onClick={handleAddGroup}>Add Group</button>
    <select value={currentGroupId} onChange={(e) => setCurretGroupId(e.currentTarget.value)}>
      <option key={undefined} value={undefined}>-- Please Select --</option>
      {groups?.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
    </select>
  </div>
  <div className="flex flex-col gap-4">
    <div>Posts</div>
    {postsWithUsers.map(x => <div className="flex gap-2">
      <div>{x.name}</div>
      {editingRow?.id === x.id ? <input value={editingRow.text} onChange={(e) => setEditingRow(prev => ({ ...prev!, text: e.target.value }))} /> : <div>{x.text}</div>}
      {editingRow?.id === x.id ? <button onClick={async () => {
        const result = await patchPost(editingRow.id, { content: editingRow.text, updated_at: new Date() })
        if (!result || !(result.status === 'ERROR')) {
          setPosts(prev => prev.map(x => x.id === editingRow.id ? { ...x, content: editingRow.text } : x))
        }
        setEditingRow(undefined)
      }}>Save</button> : <div className="flex gap-1">
        <button onClick={() => setEditingRow(x)}>Edit</button>
        <button onClick={async () => {
          await deletePost(x.id)
          setPosts(prev => prev.filter(y => y.id !== x.id))
        }}>Delete</button>
      </div>}
    </div>)}
    <div className="flex gap-2">
      <input value={currentInput} onChange={(e) => setCurrentInput(e.currentTarget.value)} />
      <button onClick={async () => {
        const id = crypto.randomUUID()
        const newPost = { 
          id: id, 
          user_id: currentUserId, 
          group_id: currentGroupId, 
          content: currentInput,
          created_at: new Date(),
          updated_at: new Date()
        }

        const result = await postPost(newPost)
        if (result && result.status === 'ERROR') {
          alert(JSON.stringify(result.message))
        } else {
          setPosts(prev => [...prev, newPost])
        }
        
        setCurrentInput('')
      }}>Submit</button>
    </div>
  </div>
  <div className="flex flex-col gap-4">
    <div>Requests</div>
    {requests.map(x => <div className="flex gap-2">
      <div>{getMessageFromRequest(x)}</div>
      <button onClick={async () => await db.request_cache.delete(x.uuid)}>Remove</button>
    </div>)}
  </div>
</div>
};

const getMessageFromRequest = (offlineRequest: RequestCache) => {
  const methods = {
    'POST': 'Adding',
    'PATCH': 'Updating',
    'DELETE': 'Deleting'
  }
  
  const tables = {
    'user_post_groups': 'user to group',
    'post_groups': 'group',
    'posts': 'post'
  }

  const table = Object.entries(tables).find(x => offlineRequest.url.includes(x[0]))?.[1] ?? 'row'
  return `${methods[offlineRequest.method]} ${table}: ${offlineRequest.status} ${JSON.stringify(offlineRequest.errorMessage)}`
}

export const tryMutation = async <T extends {}>(url: string, method: 'POST' | 'PATCH' | 'DELETE', body: T, mutateKeys: string[]) : AxiosResponse<void> => {
  if (!navigator.onLine) {
    // If offline, store the request in Dexie
    await db.request_cache.put({
      uuid: crypto.randomUUID(),
      url: url.toString(),
      method: method,
      body: body || null,
      status: 'queued',
      timestamp: new Date().getTime(),
      mutateKeys
    });

    return { status: 'SUCCESS' } as AxiosSuccess<void>
  } else {
    const result = await axiosMutate(url, method, body)
    return result
  }
}