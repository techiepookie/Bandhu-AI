import { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { auth, db } from '../firebase';
import { collection, query, addDoc, onSnapshot, serverTimestamp, orderBy, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface ViewProps {
  onNavigate: (s: ScreenType) => void;
}

export default function StudyTribe({ onNavigate }: ViewProps) {
  const [activeTribe, setActiveTribe] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [userName, setUserName] = useState('');
  const [userTribe, setUserTribe] = useState<string | null>(null);

  const tribesList = [
    { id: 'jee', name: 'JEE Warriors', count: 42, icon1: 'local_cafe', icon2: 'menu_book', icon3: 'sentiment_dissatisfied' },
    { id: 'neet', name: 'NEET Healers', count: 56, icon1: 'favorite', icon2: 'biotech', icon3: 'science' },
    { id: 'upsc', name: 'UPSC Aspirants', count: 24, icon1: 'public', icon2: 'history_edu', icon3: 'menu_book' }
  ];

  useEffect(() => {
    if (!auth.currentUser) return;
    setUserName(auth.currentUser.displayName || 'Anonymous Explorer');
    // For demo purposes getting user profile directly in component
    import('firebase/firestore').then(({ getDoc, doc }) => {
       if (auth.currentUser) {
           getDoc(doc(db, 'users', auth.currentUser.uid)).then(snap => {
               if(snap.exists()) {
                   setUserName(snap.data().name || 'Anonymous');
                   setUserTribe(snap.data().tribeId || null);
               }
           });
       }
    });
  }, []);

  useEffect(() => {
    if (!activeTribe) return;
    const q = query(collection(db, `tribes/${activeTribe.id}/posts`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [activeTribe]);

  const handleJoinTribe = async (t: any) => {
    if (!auth.currentUser) return;
    setActiveTribe(t);
    setUserTribe(t.id);
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        tribeId: t.id
    });
  };

  const handleLeaveTribe = async () => {
    if (!auth.currentUser) return;
    setUserTribe(null);
    setActiveTribe(null);
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        tribeId: null
    });
  };

  const handlePost = async () => {
    if (!newPost.trim() || !activeTribe || !auth.currentUser) return;
    await addDoc(collection(db, `tribes/${activeTribe.id}/posts`), {
        text: newPost,
        author: userName,
        likes: [],
        createdAt: serverTimestamp()
    });
    setNewPost('');
  };

  const toggleLike = async (postId: string, currentLikes: string[]) => {
      if (!auth.currentUser || !activeTribe) return;
      const uid = auth.currentUser.uid;
      const postRef = doc(db, `tribes/${activeTribe.id}/posts`, postId);
      if (currentLikes.includes(uid)) {
          await updateDoc(postRef, { likes: arrayRemove(uid) });
      } else {
          await updateDoc(postRef, { likes: arrayUnion(uid) });
      }
  };

  if (activeTribe) {
      return (
        <div className="flex-1 overflow-hidden flex flex-col bg-background w-full h-full relative">
            <header className="flex justify-between items-center w-full px-6 py-4 bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-variant z-40">
                <button onClick={() => setActiveTribe(null)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-[18px] font-bold text-on-surface">{activeTribe.name}</h1>
                <button onClick={handleLeaveTribe} className="text-error text-[14px] font-semibold">Leave</button>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 pb-24">
                <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl mb-2 text-[14px]">
                    <span className="font-bold block mb-1">Today's Prompt:</span>
                    What is one thing you learned today that you're proud of?
                </div>

                {posts.map(post => {
                    const hasLiked = auth.currentUser && post.likes?.includes(auth.currentUser.uid);
                    return (
                    <article key={post.id} className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-[14px] text-on-surface">{post.author}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase">{post.createdAt?.toDate().toLocaleTimeString([], {timeStyle: 'short'})}</span>
                        </div>
                        <p className="text-[16px] text-on-surface">{post.text}</p>
                        <div className="flex justify-start items-center gap-4 mt-2">
                            <button onClick={() => toggleLike(post.id, post.likes || [])} className={`flex items-center gap-1 text-[14px] ${hasLiked ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                                <span className="material-symbols-outlined text-[18px]">{hasLiked ? 'favorite' : 'favorite_border'}</span>
                                {post.likes?.length || 0}
                            </button>
                            <button className="flex items-center gap-1 text-[14px] text-on-surface-variant">
                                <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                                Reply
                            </button>
                        </div>
                    </article>
                )})}
            </main>

            <div className="absolute bottom-0 left-0 w-full p-4 bg-surface-container-lowest border-t border-surface-variant z-50">
                <div className="flex flex-row items-center gap-2">
                   <input 
                      type="text" 
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                      placeholder={`Post in ${activeTribe.name}...`}
                      className="flex-1 bg-surface-container rounded-full px-4 py-3 text-[14px] outline-none border border-outline-variant focus:border-primary"
                   />
                   <button onClick={handlePost} disabled={!newPost.trim()} className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform shrink-0">
                       <span className="material-symbols-outlined">send</span>
                   </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full pb-32 bg-background">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary-fixed/40 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <header className="flex justify-between items-center w-full px-6 py-6 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => onNavigate('home')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-[20px] font-bold text-primary">Bandhu</h1>
        <div className="w-10"></div>
      </header>

      <main className="relative z-10 px-6 mt-4 flex flex-col gap-10">
        <section className="flex flex-col gap-2">
          <h2 className="text-[32px] font-bold text-on-background">Study Tribes</h2>
          <p className="text-[18px] text-outline">You are not alone</p>
        </section>

        <section className="flex flex-col gap-6">
          {userTribe && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center cursor-pointer mb-2" onClick={() => setActiveTribe(tribesList.find(t => t.id === userTribe))}>
                  <p className="text-primary font-bold">You are in {tribesList.find(t => t.id === userTribe)?.name}. Tap to enter.</p>
              </div>
          )}

          {tribesList.map(tribe => (
              <article key={tribe.id} className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-5 relative overflow-hidden group">
                <header className="flex justify-between items-start z-10">
                  <h3 className="text-[18px] font-bold text-on-surface">{tribe.name}</h3>
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/20">
                    <span className="w-2 h-2 rounded-full bg-[#8fa37e] animate-pulse"></span>
                    <span className="text-[12px] font-semibold text-on-surface-variant uppercase">{tribe.count + (userTribe===tribe.id?1:0)} Active</span>
                  </div>
                </header>
                <div className="flex items-center gap-2 z-10">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm border border-surface-dim">
                    <span className="material-symbols-outlined">{tribe.icon1}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary shadow-sm border border-surface-dim">
                    <span className="material-symbols-outlined">{tribe.icon2}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-error shadow-sm border border-surface-dim">
                    <span className="material-symbols-outlined">{tribe.icon3}</span>
                  </div>
                </div>
                <button 
                   onClick={() => handleJoinTribe(tribe)}
                   className={`z-10 w-full font-semibold text-[16px] py-3.5 rounded-full flex justify-center items-center gap-2 transition-opacity mt-1 ${userTribe === tribe.id ? 'bg-surface-variant text-on-surface cursor-default' : 'bg-primary-container text-on-primary-container hover:opacity-90'}`}
                >
                    {userTribe === tribe.id ? 'Joined' : 'Join the Tribe'}
                    {userTribe !== tribe.id && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>
              </article>
          ))}

        </section>
      </main>
    </div>
  );
}
