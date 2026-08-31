(async function checkNonFollowers() {
  async function getUserId() {
    const username = window.location.pathname.split('/').filter(Boolean)[0];
    const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: { 'x-ig-app-id': '936619743392459' }
    });
    const data = await res.json();
    return data.data.user.id;
  }

  async function getList(userId, type) {
    let results = [];
    let nextCursor = null;
    let hasNext = true;

    while (hasNext) {
      let url = `https://www.instagram.com/api/v1/friendships/${userId}/${type}/?count=50`;
      if (nextCursor) url += `&max_id=${nextCursor}`;

      const res = await fetch(url, {
        headers: { 'x-ig-app-id': '936619743392459' }
      });
      const data = await res.json();

      results = results.concat(data.users.map(u => ({
        username: u.username,
        fullName: u.full_name || ''
      })));

      nextCursor = data.next_max_id;
      hasNext = !!nextCursor;

      await new Promise(r => setTimeout(r, 800));
    }
    return results;
  }

  console.log('%cFetching your user ID...', 'color: #888');
  const userId = await getUserId();

  console.log('%cFetching followers...', 'color: #888');
  const followers = await getList(userId, 'followers');

  console.log('%cFetching following...', 'color: #888');
  const following = await getList(userId, 'following');

  const followerUsernames = new Set(followers.map(f => f.username));
  const notFollowingBack = following.filter(u => !followerUsernames.has(u.username));

  // Build readable rows with clickable profile URLs
  const rows = notFollowingBack.map(u => ({
    Username: u.username,
    'Full Name': u.fullName,
    Profile: `https://www.instagram.com/${u.username}/`
  }));

  console.log(
    `%cYou follow ${following.length} · ${followers.length} follow you back · %c${notFollowingBack.length} don't follow you back`,
    'color: #888', 'color: #e1306c; font-weight: bold'
  );
  console.table(rows);

  // Copy a readable list (with links) to clipboard
  const clipboardText = rows
    .map(r => `${r.Username}${r['Full Name'] ? ' (' + r['Full Name'] + ')' : ''} — ${r.Profile}`)
    .join('\n');
  copy(clipboardText);
  console.log('%cFormatted list copied to clipboard.', 'color: #4caf50');
})();