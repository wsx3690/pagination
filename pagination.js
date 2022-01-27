
$(() => { 
  let limitedNum = Number($(".limited option:selected").val()); //每頁幾筆選單之option的值
  let currentPage = 1;
  // 要帶進去的總數量
  let totalNum = 99;
  // 執行渲染頁碼函式
  renderPagination(totalNum, limitedNum, currentPage)
  // ----------------------select chang事件-----------------------
  // 如果有每頁顯示幾筆的功能
  $(".limited").on("change", function () {
    limitedNum = Number($(".limited option:selected").val()); //每頁幾筆選單之option的值
    // 取得當下的頁碼
    currentPage == undefined ? 1 : $(".page-item-active").data("page");



    // 總數量除以每頁顯示數量後，無條件進位即為總共有幾頁  
    let pageNumber = Math.ceil(totalNum / limitedNum); //切換option時總頁碼會更動
    // currentPage - diff是為了避免如果在最後一頁，將每頁篩選10筆變成20筆時，最後一頁會變成空白的情況，減diff讓頁碼往前跳
    let diff = Math.abs(pageNumber - currentPage);

    // 重新渲染頁碼
    renderPagination(
      totalNum, limitedNum, currentPage - diff == 0 || currentPage > pageNumber
          ? pageNumber
          : currentPage
      );
  });

  // ----------------------頁碼click事件-----------------------
  // 點擊一次頁碼，就重新搜尋該頁結果
  $(".pagination").on("click", ".page", function () {
    $(this)
      .addClass("page-item-active")
      .siblings()
      .removeClass("page-item-active");

    // 取得點擊當下的頁碼
    currentPage = parseInt($(this).text());
    // 重新渲染頁碼
    renderPagination(totalNum, limitedNum, currentPage)
  });

  // 上一頁下一頁，最前頁最後頁click
  $(".pagination").on("click", ".next-page", function () {
    let next = $(".page-item-active").next();
    if (next.length && next.data("page")) {
      next.trigger("click");
    }
  });
  $(".pagination").on("click", ".prev-page", function () {
    let prev = $(".page-item-active").prev();
    if (prev.length && prev.data("page")) {
      prev.trigger("click");
    }
  });
  $(".pagination").on("click", ".first-page", function () {
    let first = $(".page-item[data-page=1]");
    first.trigger("click");
  });
  $(".pagination").on("click", ".last-page", function () {
    let pageLength = Number($(".page").last().attr("data-page"));
    let last = $(`.page-item[data-page=${pageLength}]`);
    last.trigger("click");
  });

// ----------------------函式-----------------------
// 頁碼通用函式
function renderPagination(itemTotalNum, limitedNum, pageNow) {
  // console.log("有幾個項目:", itemTotalNum);
  $(".pagination").empty();
  // 總頁碼數量
  let pageNumber = Math.ceil(itemTotalNum / limitedNum);
  let pageDom = [];
  let paginationDom;

  // 引用有刪節號的公式
  let rangeWithDots = pagination(pageNow, pageNumber); //第一個參數:當前頁碼，第二個參數:最後頁碼
  rangeWithDots.map(function (item) {
    let isActive = item === pageNow ? "page-item-active" : "";
    let isEllipsis = item == "..." ? "page-link-dots" : "";
    pageDom.push(
      `<li data-page="${item}" class="page page-item ${isActive} ${isEllipsis}"><a class="page-link">${item}</a></li>`
    );
  });
  // console.log("總共有幾頁", pageNumber);
  if (pageNumber > 1) {
    paginationDom = `
    <li class="page-item first-page ">
      <a>
        <img class="disabled" src="../image/pageArrow-first-disabled.svg" alt="最前頁"  />
        <img src="../image/pageArrow-first.svg" alt="最前頁" />
      </a>
    </li>
    <li class="page-item prev-page ">
      <a>
        <img src="../image/pageArrow-prev.svg" alt="前一頁" />
        <img class="disabled" src="../image/pageArrow-prev-disabled.svg" alt="前一頁"/>
      </a>
    </li>
    ${pageDom.join("")}
    <li class="page-item next-page">
      <a>
        <img src="../image/pageArrow-next.svg" alt="下一頁" />
        <img class="disabled" src="../image/pageArrow-next-disabled.svg" alt="下一頁"/>
      </a>
    </li>
    <li class="page-item last-page">
      <a>
        <img src="../image/pageArrow-last.svg" alt="最後一頁" />
        <img class="disabled" src="../image/pageArrow-last-disabled.svg" alt="最後一頁"/>
      </a>
    </li>`;
  } else {
    paginationDom = pageDom.join(""); //只有1頁
  }
  
  $(".pagination").append(paginationDom);
  // 在第一頁及最後一頁時，旁邊箭頭會disabled
  let totalPage = Number($(".page").last().attr("data-page"));
  // 重新再取得一次當下頁碼判斷是否需要disabled
  pageNow = $(".page-item-active").data("page");
  // console.log(pageNow, totalPage);
  pageDisabled(pageNow, totalPage);
}

// 在第一頁及最後一頁時，旁邊箭頭會disabled
function pageDisabled(currentPage, totalPage) {
  if (currentPage > 1) {
    $(".first-page, .prev-page").removeClass("page-item-disable");
  } else {
    $(".first-page, .prev-page").addClass("page-item-disable");
  }
  // 在最後一頁(當前頁碼等於總頁碼判定為最後一頁)，右邊箭頭會disable
  if (currentPage == totalPage) {
    $(".next-page, .last-page").addClass("page-item-disable");
  } else {
    $(".next-page, .last-page").removeClass("page-item-disable");
  }
}

/*---------------------頁碼規則計算-------------------------------*/
function pagination(c, m) {
  var current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}
});