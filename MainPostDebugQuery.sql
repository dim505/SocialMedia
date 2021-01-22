select * from SM_Account_Info
--select * from SM_posts



declare @Auth0IDAuthor varchar(255) = 'auth0|5e08ad7807b79e0e86d202be'
select 
  * 
from 
  (
  /*returns loggedin user posts */
    select 
      Auth0IDAuthor, 
      a.PostGuid, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      DateCreated, 
      PostContent, 
      (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          a.PostGuid = PostGuid
      ) as PostLikeCount, 
      case when (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          @Auth0IDAuthor = Auth0IDWhoLiked 
          and a.PostGuid = PostGuid
      ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, 
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList,
      'False' as DisablePostMenu
    from 
      (
        select 
          Auth0IDAuthor, 
          Post.PostGuid, 
          DateCreated, 
          PostContent, 
          case when post.DisableSharing <> 'True' then 'False' else 'True' end as DisableSharing, 
          case when post.DisableComments <> 'True' then 'False'  else 'True' end as DisableComments 
        from 
          SM_Posts Post
      ) a 
      inner join SM_Account_Info AcctInfo on Auth0IDAuthor = AcctInfo.Auth0ID 
      left join SM_Posts_File_Urls ON a.PostGuid = SM_Posts_File_Urls.PostGuid 
    where 
      Auth0IDAuthor = @Auth0IDAuthor 
    group by 
      Auth0IDAuthor, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      a.PostGuid, 
      DateCreated, 
      PostContent, 
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList 
    union 
    /*returns followers posts*/
    select 
      Auth0IDAuthor, 
      a.PostGuid, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      DateCreated, 
      PostContent, 
      (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          a.PostGuid = PostGuid
      ) as PostLikeCount, 
      case when (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          @Auth0IDAuthor = Auth0IDWhoLiked 
          and a.PostGuid = PostGuid
      ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, 
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList,
      'True' as DisablePostMenu
    from 
      (
        select 
          Auth0IDAuthor, 
          Post.PostGuid, 
          DateCreated, 
          PostContent, 
          case when post.DisableSharing <> 'True' then 'False' else 'True' end as DisableSharing, 
          case when post.DisableComments <> 'True' then 'False'  else 'True' end as DisableComments 
        from 
          SM_Posts Post
      ) a 
      inner join SM_Account_Info AcctInfo on Auth0IDAuthor = AcctInfo.Auth0ID 
      LEFT join SM_Follow_Following_Table on Auth0IDAuthor = SM_Follow_Following_Table.FollowingAuth0ID 
      left join SM_Posts_File_Urls ON a.PostGuid = SM_Posts_File_Urls.PostGuid 
    where 
      SM_Follow_Following_Table.FollowerAuth0ID = @Auth0IDAuthor 
    group by 
      Auth0IDAuthor, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      a.PostGuid, 
      DateCreated, 
      PostContent, 
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList
  ) subquery 
order by 
  convert(datetime, DateCreated) desc


  --subquery 1 

      select 
      Auth0IDAuthor, 
      a.PostGuid, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      DateCreated, 
      PostContent, 
      (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          a.PostGuid = PostGuid
      ) as PostLikeCount, 
      case when (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          @Auth0IDAuthor = Auth0IDWhoLiked 
          and a.PostGuid = PostGuid
      ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, 
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList 
    from 
      (
        select 
          Auth0IDAuthor, 
          Post.PostGuid, 
          DateCreated, 
          PostContent, 
          case when post.DisableSharing <> 'True' then 'False' else 'True' end as DisableSharing, 
          case when post.DisableComments <> 'True' then 'False' else 'True' end as DisableComments 
        from 
          SM_Posts Post
      ) a 
      inner join SM_Account_Info AcctInfo on Auth0IDAuthor = AcctInfo.Auth0ID 
      left join SM_Posts_File_Urls ON a.PostGuid = SM_Posts_File_Urls.PostGuid 
    where 
      Auth0IDAuthor = @Auth0IDAuthor 
    group by 
      Auth0IDAuthor, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      a.PostGuid, 
      DateCreated, 
      PostContent, 
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList


  --sub query 2
      select 
      Auth0IDAuthor, 
      a.PostGuid, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      DateCreated, 
      PostContent, 
      (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          a.PostGuid = PostGuid
      ) as PostLikeCount, 
      case when (
        select 
          count(*) 
        from 
          SM_LikeCommentTable 
        where 
          @Auth0IDAuthor = Auth0IDWhoLiked 
          and a.PostGuid = PostGuid
      ) >= 1 then CAST(1 AS BIT) else CAST(0 AS BIT) end as DidUserLikePost, 
      BeforeDisableSharing,
      DisableSharing, 
      BeforeDisableComments,
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList 
    from 
      (
        select 
          Auth0IDAuthor, 
          Post.PostGuid, 
          DateCreated, 
          PostContent, 
          post.DisableSharing as BeforeDisableSharing,
          case when post.DisableSharing <> 'True' then 'False' else 'True' end as DisableSharing, 
          post.DisableComments as BeforeDisableComments,
          case when post.DisableComments <> 'True' then 'False' else 'True' end as DisableComments 
        from 
          SM_Posts Post
      ) a 
      inner join SM_Account_Info AcctInfo on Auth0IDAuthor = AcctInfo.Auth0ID 
      LEFT join SM_Follow_Following_Table on Auth0IDAuthor = SM_Follow_Following_Table.FollowingAuth0ID 
      left join SM_Posts_File_Urls ON a.PostGuid = SM_Posts_File_Urls.PostGuid 
    where 
      SM_Follow_Following_Table.FollowerAuth0ID = @Auth0IDAuthor 
    group by 
      Auth0IDAuthor, 
      AcctInfo.FullName, 
      AcctInfo.ProfilePhotoUrl, 
      a.PostGuid, 
      DateCreated, 
      PostContent, 
      BeforeDisableComments,
      BeforeDisableSharing,
      DisableSharing, 
      DisableComments, 
      FileUrl, 
      FileType, 
      TempTagList
