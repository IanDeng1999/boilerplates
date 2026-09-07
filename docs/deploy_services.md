# Deploy Services

> 本文档定义了服务的灰度发布（Canary Release）标准操作流程。
> 通过双端口交替部署 + Nginx 流量切换，实现零停机发布。

---

## 前置条件

- 当前服务在 **端口 5000**（端口1）和 **端口 5001**（端口2）各运行一个实例
- Nginx 已配置 `upstream` 指向 `host.containers.internal:5000` 和 `host.containers.internal:5001`
- 构建产物（二进制 / 镜像）已就绪
- 操作前确认服务健康检查可用

---

## 灰度发布流程

### Step 1 — 全量切换至端口 1

将所有流量收敛到端口 1，确保端口 2 上的旧实例不再承接请求，为端口 2 的更新做准备。

```bash
# 1. 修改 Nginx 配置：将端口 2 的 weight 改为 0
#    编辑 nginx.conf 中 upstream 块：
#    server host.containers.internal:5000 weight=100;
#    server host.containers.internal:5001 weight=0;

# 2. 检查 Nginx 配置语法
podman exec nginx nginx -t

# 3. 重新加载 Nginx 使配置生效
podman exec nginx nginx -s reload

# 4. 验证流量是否已全部路由到端口 1
#    观察日志或使用 curl 反复请求确认
```

> 预期结果：所有请求只由端口 1 处理，端口 2 无流量进入。

---

### Step 2 — 部署端口 2（新版本）

利用端口 2 的空窗期，部署新版本服务。

```bash
# 1. 停止端口 2 上的旧服务实例
#    根据实际部署方式执行，例如：
#    podman stop unnamed-app-5001
#    podman rm unnamed-app-5001

# 2. 使用新版本镜像 / 二进制启动端口 2 实例
#    例如：
#    podman run -d --name unnamed-app-5001 \
#      -p 5001:5000 \
#      -e NODE_ENV=production \
#      your-image:new-tag

# 3. 等待服务就绪
sleep 5

# 4. 验证端口 2 健康状态
curl -f http://localhost:5001/health

# 5. 关键接口冒烟测试（根据业务补充）
#    curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/xxx
```

> 预期结果：端口 2 新版本服务正常运行，健康检查通过，尚未接入流量。

---

### Step 3 — Nginx 流量切换至端口 2

将全部流量切到端口 2（新版本），进行灰度验证。

```bash
# 1. 修改 Nginx 配置：将全部流量指向端口 2
#    编辑 nginx.conf 中 upstream 块：
#    server host.containers.internal:5000 weight=0;
#    server host.containers.internal:5001 weight=100;

# 2. 检查 Nginx 配置语法
podman exec nginx nginx -t

# 3. 重新加载 Nginx 使配置生效
podman exec nginx nginx -s reload

# 4. 验证流量已全部路由到端口 2
#    观察应用日志，确认请求已切换到新版本
```

> 预期结果：所有请求由端口 2（新版本）处理。此时进入灰度观察期，监控错误率、延迟、业务指标等。

---

### Step 4 — 部署端口 1（新版本）

灰度验证通过后，将端口 1 也升级到新版本，使双版本对齐。

```bash
# 1. 停止端口 1 上的旧服务实例
#    podman stop unnamed-app-5000
#    podman rm unnamed-app-5000

# 2. 使用与端口 2 相同的新版本镜像 / 二进制启动端口 1 实例
#    podman run -d --name unnamed-app-5000 \
#      -p 5000:5000 \
#      -e NODE_ENV=production \
#      your-image:new-tag

# 3. 等待服务就绪
sleep 5

# 4. 验证端口 1 健康状态
curl -f http://localhost:5000/health

# 5. 关键接口冒烟测试
#    curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/xxx
```

> 预期结果：端口 1 和端口 2 都运行新版本，但流量仍在端口 2。

---

### Step 5 — Nginx 配置流量均分

双端口均部署新版本后，恢复负载均衡，让流量均匀分布到两个端口。

```bash
# 1. 修改 Nginx 配置：恢复两台后端均分流量（带 ip_hash 会话保持）
#    编辑 nginx.conf 中 upstream 块：
#    server host.containers.internal:5000 weight=50;
#    server host.containers.internal:5001 weight=50;

# 2. 检查 Nginx 配置语法
podman exec nginx nginx -t

# 3. 重新加载 Nginx 使配置生效
podman exec nginx nginx -s reload

# 4. 验证流量分布
#    - 查看两个端口的访问日志，确认请求按预期比例分配
#    - 检查关键业务流程是否正常
```

> 预期结果：流量在端口 1 和端口 2 之间均匀分布（结合 `ip_hash` 保持会话一致性），发布完成。

---

## 回滚方案

若灰度过程中发现问题，按以下步骤快速回滚：

| 阶段 | 回滚操作 |
|------|---------|
| Step 2 ~ Step 3（灰度中） | 将 Nginx 流量全部切回端口 1（旧版本），然后停止端口 2 新实例 |
| Step 4 ~ Step 5（全量后） | 将两个端口均回退到上一个版本的镜像/二进制，恢复原 Nginx 配置 |

```bash
# 快速回滚命令（示例：Step 3 阶段回滚）
# 编辑 nginx.conf：
#   server host.containers.internal:5000 weight=100;
#   server host.containers.internal:5001 weight=0;
podman exec nginx nginx -t && podman exec nginx nginx -s reload
# 停止端口 2 新实例
podman stop unnamed-app-5001 && podman rm unnamed-app-5001
```

---

## 检查清单

发布完成后，逐项确认：

- [ ] Nginx 配置语法检查通过
- [ ] Nginx reload 成功，无报错
- [ ] 端口 1 健康检查通过
- [ ] 端口 2 健康检查通过
- [ ] 核心 API 冒烟测试通过
- [ ] 日志无异常错误
- [ ] 业务监控指标正常
